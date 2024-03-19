import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native'; // Correct import for useFocusEffect

// Images
const in_progress_expand = require('./assets/in_progress_activity_expand.png');
const completed_expand = require('./assets/completed_activity_expand.png');
const expand_arrow = require('./assets/expand_arrow.png');


const SavedScreen = () => {
    const navigation = useNavigation();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchActivities = async () => {
        setLoading(true); // Show loading indicator while fetching
        try {
            const response = await axios.get('http://127.0.0.1:5000/get_saved_activities');
            setActivities(response.data);
        } catch (error) {
            console.error('Failed to fetch saved activities:', error);
        } finally {
            setLoading(false); // Hide loading indicator once fetching is done
        }
    };

    const navigateToActivityScreen = (activityId) => {
        navigation.navigate('Activity1', { activityId });
    };
    

    useFocusEffect(
        React.useCallback(() => {
            fetchActivities();
            return () => {};
        }, [])
    );

    // Loading state UI
    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafc' }}>
            <ScrollView 
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.inProgressContainer}>
                    <Text style={styles.sectionTitle}>
                        In Progress
                    </Text>
                    <Image source={expand_arrow} style={styles.arrowIcon} />
                </View>
                <View style={styles.separator} />

                {activities.length > 0 ? (
                    activities.map((activity, index) => (
                        <View key={index} style={styles.inProgressActivityContainer}>
                            <View style={{flex: 1, justifyContent: 'center'}}> 
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                    <Text style={styles.activityTitle}>{activity.title}</Text>
                                </View>
                                <View style={styles.tagContainer}>
                                    <Text style={styles.tagStyle}>{activity.typeOfActivity}</Text>
                                    <Text style={styles.tagStyle}>{activity.location}</Text>
                                    <Text style={styles.tagStyle}>{activity.mood}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => navigateToActivityScreen(activity.activity_id)}>
                                <Image source={in_progress_expand} style={styles.inProgressIcon} />
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text>No saved activities found.</Text>
                )}
                </ScrollView>
        </SafeAreaView>

        //         <View style={styles.inProgressContainer}>
        //             <Text style={styles.sectionTitle}>
        //                 Completed
        //             </Text>
        //             <Image source={expand_arrow} style={styles.arrowIcon} />
        //         </View>
        //         <View style={styles.separator} />

        //         <View style={styles.inProgressActivityContainer}>


        //         </View>

        //     </View>
        // </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 15,
        marginVertical: 12,
    },
    inProgressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-SemiBold',
        color: '#1A1A1A',
    },
    separator: {
        height: 1.3,
        width: "100%",
        backgroundColor: "#DFDEDE",
        marginVertical: 15,
    },
    arrowIcon: {
        width: 18,
        height: 18,
    },
    inProgressIcon: {
        width: 18,
        height: 18,
    },
    inProgressActivityContainer: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        height: 57,
        flexDirection: 'row', // Adjusted
        justifyContent: 'space-between', // Adjusted
        alignItems: 'center', // Adjusted
        marginBottom: 15,
        padding: 10,
        borderRadius: 12,
    },
    
    tagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    tagStyle: {
        fontSize: 10,
        fontFamily: 'Montserrat-Regular',
        color: '#1A1A1A',
        borderColor: '#D9D9D9',
        backgroundColor: '#D9D9D9',
        marginRight: 6,
        paddingHorizontal: 5,
        borderRadius: 3,
        borderWidth: 1,
        overflow: 'hidden',
    },
    completedActivityContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    activityTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 12,
        color: '#1A1A1A'
    },

});

export default SavedScreen;
