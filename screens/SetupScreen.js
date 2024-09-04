import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Switch, Animated } from 'react-native';


const numColumns = 2;
const buttonMargin = 5;
const buttonSize = ((Dimensions.get("window").width - buttonMargin * (numColumns * 2)) / numColumns) * 0.55;



function SetupScreen({ navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#FFF' }}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}/>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.regenerateButton]}
                      onPress={() => navigation.navigate('SignUp')}
                    >
                    <Text style={[styles.buttonText, styles.regenerateButtonText]}>
                        Sign up
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.startButton]}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={[styles.buttonText, styles.startButtonText]}>
                    Log in
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      backgroundColor: "#FFF",
      paddingHorizontal: 18,
    },
    scrollContainer: {
      flexGrow: 1,
      backgroundColor: "#FFF",
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',     
        paddingBottom: 10, 
        paddingTop: 10,
        backgroundColor: '#fff',
    },
    button: {
      minWidth: "90%",
      height: 45,
      borderRadius: buttonSize / 2,
      justifyContent: "center",
      alignItems: "center",
    },
    startButton: {
      backgroundColor: "#2b2b2b",
    },
    regenerateButton: {
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#000",
        marginBottom: 10,  // Add this line
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "bold",
    },
    startButtonText: {
      color: "#FFF",
    },
    regenerateButtonText: {
      color: "#000",
    },
    separator: {
      height: 1.3,
      width: "100%",
      backgroundColor: "#DFDEDE",
      marginVertical: 15,
    },
  });
    
export default SetupScreen;