import React, { useState } from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { Video } from 'expo-av';

function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('Logged in with:', username, password);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.form}>
                    <Video
                        source={require('./assets/Planpickr.mp4')} // local video file
                        style={styles.titleVideo}
                        muted={true}
                        repeat={false}
                        resizeMode={"cover"}
                        rate={1.3}
                        ignoreSilentSwitch={"obey"}
                        shouldPlay  // This prop ensures the video plays immediately
                    />

                    <TextInput
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Username"
                        style={styles.input}
                        placeholderTextColor="#888"
                    />
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        secureTextEntry={true}
                        style={styles.input}
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Log in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    titleVideo: {
        width: '100%',
        height: 200, // Adjust the height as needed
        marginBottom: 0,
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: '10%',
        marginTop: '-80%',  
    },
    title: {
        fontSize: 50,
        textAlign: 'center',
        marginBottom: 40,
        color: '#333',
        fontFamily: 'Avenir-Roman',
      },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 20,
        borderRadius: 50,
        fontSize: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,  // for Android
    },
    button: {
        backgroundColor: '#2b2b2b',
        borderRadius: 50,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,  // for Android
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default LoginScreen;
