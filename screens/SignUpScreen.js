import React, { useState } from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image} from 'react-native';
import { Video } from 'expo-av';

function SignUpScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleLogin = async () => {
        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
    
        // Construct the request payload
        const payload = {
            username,
            email,
            password
        };
    
        try {
            // Make the API request
            const response = await fetch('http://192.168.0.106:8080/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
    
            const data = await response.json();
            
            if (response.status !== 200) {
                alert(data.message || 'Error signing up');
                return;
            }
    
            // Handle successful registration (e.g., navigate to another screen)
            console.log('Successfully registered:', data);
            navigation.navigate('YourNextScreen'); // Adjust as needed
    
        } catch (error) {
            console.error('Error:', error);
            alert('Error signing up. Please try again later.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.form}>
                    <Text style={styles.title}>Register</Text>
                    <Text style={{textAlign: 'center', fontSize: 22, marginBottom: 20, color: '#aaa', fontFamily: 'Avenir-Roman'}}>Create your new account</Text>
    
                    <View style={styles.inputContainer}>
                        <Image source={require('./assets/setup_user.png')} style={styles.icon} />
                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Username"
                            style={styles.input}
                            placeholderTextColor="#888"
                        />
                    </View>
    
                    <View style={styles.inputContainer}>
                        <Image source={require('./assets/setup_mail.png')} style={styles.icon} />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            style={styles.input}
                            placeholderTextColor="#888"
                        />
                    </View>
    
                    <View style={styles.inputContainer}>
                        <Image source={require('./assets/setup_lock.png')} style={styles.icon} />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                            secureTextEntry={true}
                            style={styles.input}
                            placeholderTextColor="#888"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Image source={require('./assets/setup_confirm_password.png')} style={{marginLeft: 13, height: 24, width: 24, tintColor: '#2b2b2b'}} />
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm Password"
                            secureTextEntry={true}
                            style={{flex: 1,
                                paddingVertical: 12,
                                paddingHorizontal: 12,
                                fontSize: 16,
                                color: '#333',}}
                            placeholderTextColor="#888"
                        />
                    </View>
    
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Sign Up</Text>
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
        marginTop: '-20%',
        height: 160, // Adjust the height as needed
        marginBottom: 0,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: '#eee',
        //shadowColor: '#000',
        //shadowOpacity: 0.1,
        //shadowOffset: { width: 0, height: 2 },
        elevation: 3,  // for Android
    },
    icon: {
        marginLeft: 15,
        height: 20,
        width: 20,
        tintColor: '#2b2b2b'
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
        
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
        marginBottom: 10,
        color: '#333',
        fontFamily: 'Avenir-Roman',
    },
    button: {
        backgroundColor: '#2b2b2b',
        borderRadius: 25,
        paddingVertical: 15,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,  // for Android
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default SignUpScreen;
