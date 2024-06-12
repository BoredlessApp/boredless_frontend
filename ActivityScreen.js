import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Animated } from 'react-native';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SquareCheckbox, CircleCheckbox } from "./Checkbox";

const numColumns = 2;
const buttonMargin = 5;
const buttonSize = ((Dimensions.get("window").width - buttonMargin * (numColumns * 2)) / numColumns) * 0.55;

const ActivityScreen = ({ route }) => {
    const [activityContent, setActivityContent] = useState({
        activityImage: null,
        title: '',
        introduction: '',
        materials: '',
        instructions: ''
    });
    const navigation = useNavigation();
    const [isGenerating, setIsGenerating] = useState(false);
    const { prompt } = route.params;
    const [loading, setLoading] = useState(true);
    const [revealContent, setRevealContent] = useState(false);
    const [showCompleteButton, setShowCompleteButton] = useState(false);
    const [sessionID, setSessionID] = useState(null);
    const scrollViewRef = useRef(null);
    const [materialsChecked, setMaterialsChecked] = useState(new Array(activityContent.materials.length).fill(false));
    const [instructionsChecked, setInstructionsChecked] = useState(new Array(activityContent.instructions.length).fill(false));
    const [isActivityCompleted, setIsActivityCompleted] = useState(false);

    const [imageAnimation] = useState(new Animated.Value(0));
    const [titleAnimation] = useState(new Animated.Value(0));
    const [introAnimation] = useState(new Animated.Value(0));
    const [materialsOpacity] = useState(new Animated.Value(0));
    const [instructionsOpacity] = useState(new Animated.Value(0));


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

    useEffect(() => {
        animateContent();
    }, []);

    const animateContent = () => {
        Animated.stagger(100, [
            Animated.timing(imageAnimation, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(titleAnimation, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(introAnimation, { toValue: 1, duration: 500, useNativeDriver: true })
        ]).start();
    };

    const fadeInMaterialsAndInstructions = () => {
        Animated.sequence([
            Animated.timing(materialsOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
            Animated.delay(100), // Add a 500ms delay before starting the next animation
            Animated.timing(instructionsOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ]).start();
    };

    let scrollIntervalId = null;
    const scrollToBottom = () => {
        const scrollView = scrollViewRef.current;
        if (!scrollView) return;
        const totalScrollHeight = 800;
        const scrollStep = 3;
        const intervalDuration = 1;

        let currentScrollPosition = 0;

        const interval = setInterval(() => {
            currentScrollPosition += scrollStep;

            if (currentScrollPosition >= totalScrollHeight) {
                clearInterval(interval); // Stops scrolling when the bottom is reached
            }

            scrollView.scrollTo({ y: currentScrollPosition, animated: false });
        }, intervalDuration);
        scrollIntervalId = interval;
    };

    const generateActivity = async (isRegenerate) => {
        setIsGenerating(true);
        setLoading(true);
        setRevealContent(false);
        setShowCompleteButton(false);

        // Reset opacity values to 0
        materialsOpacity.setValue(0);
        instructionsOpacity.setValue(0);
        if (activityContent) {
            updateCheckboxes(activityContent.materials.split('\n'), activityContent.instructions.split('\n'));
        }

        const apiEndpoint = isRegenerate ? 'regenerate' : 'generate';
        console.log('API ENDPOINT:', apiEndpoint)
        console.log('SESSION ID:', sessionID)

        // Prepare the correct payload
        const payload = isRegenerate ? { sessionID: sessionID, ...prompt } : { ...prompt };
        //console.log("Sending payload to /regenerate:", payload);
        try {
            let response = await axios.post(`http://127.0.0.1:5000/${apiEndpoint}`, payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (!isRegenerate) {
                setSessionID(response.data.sessionID);
            }

            const fullText = response.data.response;
            let title = '', introduction = '', materials = '', instructions = '';
            let currentSection = 'title';
            let ignoreFollowing = false; // Flag to ignore lines after "Note:"

            fullText.split('\n').forEach(line => {
                line = line.trim();

                // Check for "Note:" to start ignoring following content
                if (line.toLowerCase().startsWith("note:")) {
                    ignoreFollowing = true; // Set the flag to true when "Note:" is encountered
                }

                // If the flag is true, skip processing further lines
                if (ignoreFollowing) return;

                // Process sections as before
                if (line.toLowerCase().startsWith("activity:")) {
                    currentSection = 'title';
                    title += line.substring("Activity:".length).trim() + '\n'; // Skip the header
                } else if (line.toLowerCase().startsWith("introduction:")) {
                    currentSection = 'introduction';
                } else if (line.toLowerCase().startsWith("materials:")) {
                    currentSection = 'materials';
                } else if (line.toLowerCase().startsWith("instructions:")) {
                    currentSection = 'instructions';
                } else {
                    // Handle instruction formatting
                    if (currentSection === 'instructions') {
                        // Ensure new lines for instruction steps, regardless of list or number format
                        instructions += `${line}\n`; // Append the line and a newline character
                    } else {
                        // Process other sections as before
                        switch (currentSection) {
                            case 'title':
                                title += `${line}\n`;
                                break;
                            case 'introduction':
                                introduction += `${line}\n`;
                                break;
                            case 'materials':
                                materials += `${line}\n`;
                                break;
                        }
                    }
                }
            });

            // Update the state with the new content
            setActivityContent({
                activityImage: null,
                title: title.trim(),
                introduction: introduction.trim(),
                materials: materials.trim(),
                instructions: instructions.trim(),
            });
            // Now generate the image with the title
            await generateImage(title.trim()); // Make sure this function updates activityContent including the image
        } catch (error) {
            console.error('Error processing activity:', error.response ? error.response.data : error);
        } finally {
            setIsGenerating(false);
        }
    };

    const generateImage = async (title) => {
        try {
            console.log("Generating Image with title:", title);
    
            const response = await axios.post('http://127.0.0.1:5000/generate_image', {
                activityTitle: title,
                n: 1
            });
    
            // Check if the API response contains an image
            if (response.data && response.data.image) {
                const imageBase64 = response.data.image;
                setActivityContent(prevContent => ({
                    ...prevContent,
                    activityImage: `data:image/png;base64,${imageBase64}`,
                }));
            }
        } catch (error) {
            console.error('Error generating image:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const startActivityButtonHandler = async () => {
        console.log("Start Activity button pressed");
        //await saveActivity();
        setRevealContent(true); // Update UI to reveal the activity content
        fadeInMaterialsAndInstructions(); // Start animation for materials and instructions
        scrollToBottom(); // Scroll to the bottom of the screen/view
        setShowCompleteButton(true); // Show the "Complete" button
    };

    // const bookmarkActivityButtonHandler = () => {
    //     console.log("Bookmark Activity button pressed");
    // }
    
    const buttonHandler = async () => {
        console.log("Continue Later button pressed");
        await saveActivity();
        navigation.navigate('Generate');
    };

    const saveActivity = async () => {
        const cleanMaterialsChecked = materialsChecked.map(item => !!item);
        const cleanInstructionsChecked = instructionsChecked.map(item => !!item);

        const payload = {
            sessionID: sessionID,
            activityImage: activityContent.activityImage.startsWith('data:image/png;base64,')
                ? activityContent.activityImage.split(',')[1]
                : activityContent.activityImage,
            title: activityContent.title,
            introduction: activityContent.introduction,
            materials: activityContent.materials,
            instructions: activityContent.instructions,
            materialsChecked: cleanMaterialsChecked,
            instructionsChecked: cleanInstructionsChecked,
            location: prompt.location,
            mood: prompt.mood,
            participants: prompt.participants,
            timeOfDay: prompt.timeOfDay,
            typeOfActivity: prompt.typeOfActivity,
            isCompleted: isActivityCompleted,
        };
    
        //console.log("Payload to /save_activity:", payload);
    
        try {
            const response = await axios.post('http://127.0.0.1:5000/save_activity', payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            //console.log("Activity saved successfully", response.data); // Log success message and any response data
        } catch (error) {
            console.error('Error saving activity:', error.response ? error.response.data : error);
        }
    };

    const updateActivity = async () => {
        try {
            const response = await axios.put(`http://127.0.0.1:5000/update_activity/${sessionID}/${savedActivityID}`, {
                materialsChecked: materialsChecked,
                instructionsChecked: instructionsChecked,
                isCompleted: isActivityCompleted,
                lastUpdated: lastUpdated,
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log("Activity updated successfully");
        } catch (error) {
            console.error('Failed to update activity:', error.response ? error.response.data : error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            //console.log("Focus Effect: prompt =", prompt);
            setLoading(true);
            setActivityContent({
                activityImage: null,
                title: '',
                introduction: '',
                materials: '',
                instructions: ''
            });
            if (prompt) {
                //console.log("Setting initialPrompt:", prompt);
                generateActivity(false);
            }
        }, [prompt])
    );

    useEffect(() => {
        return () => {
            if (scrollIntervalId) {
                clearInterval(scrollIntervalId);
            }
        };
    }, []);

    useEffect(() => {
        if (activityContent) {
            // Assuming materials and instructions are separated by new lines
            const materialsCount = activityContent.materials.split('\n').filter(Boolean).length;
            const instructionsCount = activityContent.instructions.split('\n').filter(Boolean).length;
            
            setMaterialsChecked(new Array(materialsCount).fill(false));
            setInstructionsChecked(new Array(instructionsCount).fill(false));
        }
    }, [activityContent]);

    useEffect(() => {
        const allMaterialsChecked = materialsChecked.every(Boolean); // True if all materials are checked
        const allInstructionsChecked = instructionsChecked.every(Boolean); // True if all instructions are checked
    
        setIsActivityCompleted(allMaterialsChecked && allInstructionsChecked);
    }, [materialsChecked, instructionsChecked]);
    
    //Page Rendering
    return (
        <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#fafafc', }}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#000" />
                    <Text style={{ marginTop: 20 }}>Generating activity...</Text>
                </View>
            ) : (
                <View style={styles.container}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        ref={scrollViewRef}
                        onScrollBeginDrag={() => {
                            if (scrollIntervalId) {
                                clearInterval(scrollIntervalId);
                            }
                        }}
                    >
                        {/* Activity Image */}
                        {activityContent.activityImage && (
                            <Animated.View style={[styles.imageContainer, {
                                opacity: imageAnimation,
                                transform: [{
                                    translateY: imageAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-30, 0]
                                    })
                                }]
                            }]}>
                                <Image
                                    style={styles.activityImage}
                                    source={{ uri: activityContent.activityImage }}
                                />
                            </Animated.View>
                        )}

                        {/* Activity Title */}
                        <Text style={styles.activityTitle}>{activityContent.title}</Text>
                        <View style={styles.separator} />

                        {/* Activity Introduction */}
                        <Text style={styles.introText}>{activityContent.introduction}</Text>
                        <View style={styles.separator} />

                        
                        {/* Activity Materials Needed*/}
                        <Text style={styles.titleText}>Materials Needed</Text>
                        {revealContent && activityContent.materials && activityContent.materials.trim().length > 0 && (
                            <>
                                <Animated.View style={{ opacity: materialsOpacity }}>
                                    {activityContent.materials.split('\n').map((material, index) => {
                                        material = material.replace(/^-/, '•').trim();
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
                                </Animated.View>
                            </>
                        )}
                        <View style={styles.separator} />
                        
                        {/* Activity Instructions*/}
                        <Text style={styles.titleText}>Instructions</Text>
                        {revealContent && activityContent.instructions && activityContent.instructions.trim().length > 0 && (
                            <>
                                <Animated.View style={{ opacity: instructionsOpacity }}>
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
                                </Animated.View>
                            </>
                        )}
                    </ScrollView>

                    {/* Regenerate and Start Activity Buttons */}
                    {!showCompleteButton && (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.regenerateButton]}
                                onPress={() => generateActivity(true)}
                                disabled={isGenerating}
                            >
                                <Text style={[styles.buttonText, styles.regenerateButtonText]}>
                                    Regenerate
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.startActivityButton]}
                                onPress={startActivityButtonHandler}
                            >
                                <Text style={[styles.buttonText, styles.startActivityButtonText]}>
                                    Start Activity
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* continueLater Button and Complete Button */}
                    {showCompleteButton && (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.continueLaterButton]} // Ensure you have styles defined for this
                                onPress={buttonHandler}
                            >
                                <Text style={[styles.buttonText, styles.continueLaterButtonText]}>
                                    Continue Later
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.completeButton, !isActivityCompleted && styles.buttonDisabled]} // Apply disabled style if not isActivityCompleted
                                onPress={buttonHandler}
                                disabled={!isActivityCompleted} // Disable button interaction if not isActivityCompleted
                            >
                                <Text style={[styles.buttonText, styles.completeButtonText]}>
                                    Complete
                                </Text>
                            </TouchableOpacity>

                        </View>
                    )}
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // Containers
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 18,
        backgroundColor: '#fafafc',
    },
    imageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    instructionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderColor: '#fff',
        backgroundColor: '#fafafc',
    },
    webView: {
        flex: 1,
        margin: 10,
    },
    // Scrolling Effect
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

    // Activity Style
    activityImage: {
        width: "100%",
        height: 260,
        borderRadius: 20,
        marginTop: 17,
        marginBottom: 20,
    },
    activityTitle: {
        fontSize: 20,
        textAlign: "left",
        fontWeight: "bold",
        fontFamily: 'Montserrat-SemiBold',
    },
    introText: {
        fontSize: 13,
        textAlign: "left",
        fontFamily: 'Montserrat-Regular',
    },
    materialText: {
        fontSize: 13,
        textAlign: "left",
        maxWidth: "70%",
        fontFamily: 'Montserrat-Regular',
    },
    instructionText: {
        fontSize: 13,
        textAlign: "left",
        maxWidth: "70%",
        fontFamily: 'Montserrat-Regular',
    },
    titleText: {
        fontSize: 16,
        marginBottom: 5,
        textAlign: "left",
        fontFamily: 'Montserrat-Medium',
    },


    // Button Style
    button: {
        width: 165,
        height: 57,
        borderRadius: buttonSize / 8,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        // Android Shadow
        elevation: 8,
    },
    buttonText: {
        fontSize: 14,
    },
    startActivityButton: {
        backgroundColor: "#2b2b2b",
        borderColor: "#000",
        shadowColor: "#000",
    },
    startActivityButtonText: {
        color: "#FFF",
        fontFamily: 'Montserrat-Bold',
    },

    regenerateButton: {
        backgroundColor: "#FFF",
        borderWidth: 1,
        shadowColor: "#000",
    },
    regenerateButtonText: {
        color: "#000",
        fontFamily: 'Montserrat-Bold',
    },

    continueLaterButton: {
        backgroundColor: "#FFF",
        borderWidth: 1,
        shadowColor: "#000",
    },
    continueLaterButtonText: {
        color: "#000",
        fontFamily: 'Montserrat-Bold',
    },

    completeButton: {
        backgroundColor: "#2b2b2b",
        borderRadius: 15,
        paddingVertical: 10,
        alignSelf: 'stretch',

        // iOS Shadow
        shadowColor: '#000', // Shadow color
        shadowOffset: {
        width: 0,
        height: 4,
        },
        shadowOpacity: 0.3, // Shadow opacity
        shadowRadius: 5, // Blur radius

        // Android Shadow
        elevation: 8,
      },
    completeButtonText: {
        color: "#fff",
        fontFamily: 'Montserrat-Bold',
    },
    buttonDisabled: {
        backgroundColor: '#ccc', // Example disabled color
        // Other styling to indicate disabled state...
    },

    // Seperator
    separator: {
        height: 1.3,
        width: "100%",
        backgroundColor: "#DFDEDE",
        marginVertical: 15,
    },
});

export default ActivityScreen;