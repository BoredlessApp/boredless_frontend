import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Switch, Animated } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { SquareCheckbox, CircleCheckbox } from "./Checkbox";

const numColumns = 2;
const buttonMargin = 5;
const buttonSize = ((Dimensions.get("window").width - buttonMargin * (numColumns * 2)) / numColumns) * 0.55;

const ActivityScreen = ({ navigation, route }) => {
    const [activityContent, setActivityContent] = useState({
        activity: '',
        introduction: '',
        materials: '',
        instructions: ''
    });
    const [currentSection, setCurrentSection] = useState('activity');
    const [isGenerating, setIsGenerating] = useState(false);
    const [initialPrompt, setInitialPrompt] = useState(null);
    const prompt = route.params?.prompt;
    const [loading, setLoading] = useState(true);

    
    const [materialsChecked, setMaterialsChecked] = useState(new Array(activityContent.materials.length).fill(false));
    const [instructionsChecked, setInstructionsChecked] = useState(new Array(activityContent.instructions.length).fill(false));

    const handleMaterialCheckboxChange = (index, newValue) => {
        const updatedMaterialsChecked = [...materialsChecked];
        updatedMaterialsChecked[index] = newValue;
        setMaterialsChecked(updatedMaterialsChecked);
    };
    
    const handleInstructionCheckboxChange = (index, newValue) => {
        const updatedInstructionsChecked = [...instructionsChecked];
        updatedInstructionsChecked[index] = newValue;
        setInstructionsChecked(updatedInstructionsChecked);
    };

    const updateCheckboxes = (materials, instructions) => {
        setMaterialsChecked(new Array(materials.length).fill(false));
        setInstructionsChecked(new Array(instructions.length).fill(false));
    };
    
    const generateActivity = async () => {
        console.log("generateActivity: Sending prompt:", prompt);
        setIsGenerating(true); // Start of generation
        // Call updateCheckboxes here after all chunks are processed
        updateCheckboxes(activityContent.materials.split('\n'), activityContent.instructions.split('\n'));
        try {
            let response = await axios.post('http://127.0.0.1:5000/generate', {
                prompt: prompt
            });
            console.log("Response received:", response.data);

            let section = 'activity';
            for (let word of response.data.response.split(' ')) {
                section = appendContent(word, section);
            }

            const requestKey = response.data.request_key;
            setLoading(false);

            const fetchNextChunk = async () => {
                let chunkResponse = await axios.get(`http://127.0.0.1:5000/next_chunk/${requestKey}`);

                if (!chunkResponse.data.response) {
                    setIsGenerating(false); // End of generation
                    return;
                }

                for (let word of chunkResponse.data.response.split(' ')) {
                    section = appendContent(word, section);
                }

                setTimeout(fetchNextChunk, 50); 
            };

            fetchNextChunk();
    
        } catch (error) {
            console.error("Error in generateActivity:", error.message);
            if (error.response) {
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            } else if (error.request) {
                console.error(error.request);
            } else {
                console.error('Error', error.message);
            }
            setLoading(false);
            setIsGenerating(false);
        }
    };
    
    const regenerateActivity = async () => {
        console.log("regenerateActivity: Sending initialPrompt:", initialPrompt);
        setIsGenerating(true);
        // Call updateCheckboxes here after all chunks are processed
        updateCheckboxes(activityContent.materials.split('\n'), activityContent.instructions.split('\n'));
        try {
            setLoading(true); // Enable loading screen
            setActivityContent({
                activity: '',
                introduction: '',
                materials: '',
                instructions: ''
            });
            setCurrentSection('activity');
    
            let response = await axios.post('http://127.0.0.1:5000/regenerate', {
                prompt: initialPrompt
            });
            console.log("Response received:", response.data);
    
            let section = 'activity';
            for (let word of response.data.response.split(' ')) {
                section = appendContent(word, section);
            }
    
            const requestKey = response.data.request_key;
            setLoading(false); // Disable loading screen once the first chunk is processed
    
            // Function to fetch the next chunk of data
            const fetchNextChunk = async () => {
                let chunkResponse = await axios.get(`http://127.0.0.1:5000/next_chunk/${requestKey}`);
    
                if (!chunkResponse.data.response) {
                    setIsGenerating(false); // End of generation
                    return;
                }
    
                for (let word of chunkResponse.data.response.split(' ')) {
                    section = appendContent(word, section);
                }
    
                // Set a delay for the next chunk to be fetched
                setTimeout(fetchNextChunk, 50); 
            }
    
            // Start fetching subsequent chunks
            fetchNextChunk();
    
        } catch (error) {
            console.error("Error in regenerateActivity:", error.message);
            if (error.response) {
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
            } else if (error.request) {
                console.error(error.request);
            } else {
                console.error('Error', error.message);
            }
            setLoading(false); // Disable loading screen on error
            setIsGenerating(false);
        }
    };
    
    
    const appendContent = (word, currentSection) => {
        console.log(`Processing word: ${word.trim()}, Current section: ${currentSection}`);
        
        word = word.trim();
    
        if (word.toLowerCase() === "note:") {
            // Stop appending content once we detect "Note:"
            return 'end';
        } else if (word.toLowerCase() === "activity:") {
            console.log("Switched to 'activity' section");
            return 'activity';
        } else if (word.toLowerCase() === "introduction:") {
            console.log("Switched to 'introduction' section");
            return 'introduction';
        } else if (word.toLowerCase() === "materials:") {
            console.log("Switched to 'materials' section");
            return 'materials';
        } else if (word.toLowerCase() === "instructions:") {
            console.log("Switched to 'instructions' section");
            return 'instructions';
        } else if (currentSection !== 'end') {
            setActivityContent(prevContent => {
                let updatedSection;
                if (word === "-" && prevContent[currentSection] && !prevContent[currentSection].endsWith("\n") && prevContent[currentSection] !== '') {
                    updatedSection = prevContent[currentSection] + '\n' + word;
                } else if (word.endsWith(".") && !isNaN(word.charAt(0)) && prevContent[currentSection] && !prevContent[currentSection].endsWith("\n") && prevContent[currentSection] !== '') {
                    updatedSection = prevContent[currentSection] + '\n' + word;
                } else {
                    const separator = prevContent[currentSection] ? ' ' : '';
                    updatedSection = prevContent[currentSection] + separator + word;
                }
                return {
                    ...prevContent,
                    [currentSection]: updatedSection.trimStart()  // This will ensure that the content does not start with a space
                };
            });
        }
        return currentSection;
    };
    

    useFocusEffect(
        React.useCallback(() => {
            console.log("Focus Effect: prompt =", prompt);
            setLoading(true);
            setActivityContent({
                activity: '',
                introduction: '',
                materials: '',
                instructions: ''
            });
            setCurrentSection('activity');
            if (prompt) {
                setInitialPrompt(prompt); // Setting initial prompt
                console.log("Setting initialPrompt:", prompt);
                generateActivity();
            }
        }, [prompt])
    );

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#000" />
                    <Text style={{ marginTop: 20 }}>Generating activity...</Text>
                </View>
            ) : (
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                        <Text style={styles.activityTitle}>{activityContent.activity}</Text>
                        <View style={styles.separator} />

                        <Text style={styles.introduction}>{activityContent.introduction}</Text>
                        <View style={styles.separator} />

                        <Text style={styles.titleText}>Materials Needed:</Text>
                        {activityContent.materials.split('\n').map((material, index) => {
                            // Remove leading "-" and trim any spaces
                            material = material.replace(/^-/, '').trim();
                            return (
                                <View key={index} style={styles.instructionContainer}>
                                    <Text style={styles.materialText}>{material}</Text>
                                    <CircleCheckbox
                                        value={materialsChecked[index]}
                                        onValueChange={(newValue) => {
                                            handleMaterialCheckboxChange(index, newValue);
                                        }}
                                        color="#000"
                                    />
                                </View>
                            );
                        })}
                        <View style={styles.separator} />

                        <Text style={styles.titleText}>Instructions:</Text>
                        {activityContent.instructions.split('\n').map((instruction, index) => (
                            <View key={index} style={styles.instructionContainer}>
                                <Text style={styles.instructionText}>{instruction}</Text>
                                <SquareCheckbox
                                    value={instructionsChecked[index]}
                                    onValueChange={(newValue) => {
                                        handleInstructionCheckboxChange(index, newValue);
                                    }}
                                    color="#000"
                                />
                            </View>
                        ))}
                    </ScrollView>
                    <View style={styles.buttonContainer}>
                    <TouchableOpacity
                            style={[styles.button, styles.refreshButton]}
                            onPress={regenerateActivity}
                            disabled={isGenerating}
                        >
                            <Text style={[styles.buttonText, styles.refreshButtonText]}>
                                Refresh
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.startActivityButton]}
                            onPress={() => {
                                // Handle "new activity" button press
                            }}
                            >
                            <Text style={[styles.buttonText, styles.startActivityButtonText]}>
                                Start Activity
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      backgroundColor: "#FFF",
      paddingHorizontal: 18,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    fadeOutOverlay: {
        position: 'absolute',
        bottom: 70,
        left: 0,
        right: 0,
        height: 30,
    },
    webView: {
      flex: 1,
      margin: 10,
    },
    introText: {
      fontSize: 16,
      textAlign: "left",
    },
    materialText: {
      fontSize: 16,
      textAlign: "left",
      maxWidth: "70%",
    },
    instructionText: {
      fontSize: 16,
      textAlign: "left",
      maxWidth: "70%",
    },
    instructionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    activityTitle: {
      fontSize: 24,
      textAlign: "left",
      fontWeight: "bold",
      paddingTop: 16,
    },
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingBottom: 10, 
        paddingTop: 10,
        borderTopWidth: 0.3,
        borderColor: '#ccc',
    },
    button: {
      width: 165,
      height: 52,
      borderRadius: buttonSize / 8,
      justifyContent: "center",
      alignItems: "center",
    },
    refreshButton: {
      backgroundColor: "#FFF",
      borderWidth: 1,
    },
    startActivityButton: {
      backgroundColor: "#2b2b2b",
      borderColor: "#000",
    },
    buttonText: {
      fontSize: 18,
      fontWeight: "bold",
    },
    refreshButtonText: {
      color: "#000",
    },
    startActivityButtonText: {
      color: "#FFF",
    },
    separator: {
      height: 1.3,
      width: "100%",
      backgroundColor: "#DFDEDE",
      marginVertical: 15,
    },
    titleText: {
      fontSize: 20,
      marginBottom: 16,
      textAlign: "left",
    },
    photoButton: {
      backgroundColor: "#2b2b2b",
    },
    completeButton: {
      backgroundColor: "#FFF",
      borderWidth: 1,
      borderColor: "#000",
    },
    photoButtonText: {
      color: "#FFF",
    },
    completeButtonText: {
      color: "#000",
    },
  });

export default ActivityScreen;