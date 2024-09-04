import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Progress from 'react-native-progress';


// Images
const in_progress_expand_activity = require('../assets/other_icons/in_progress_activity_expand.png');
const completed_expand_activity = require('../assets/other_icons/completed_activity_expand.png');
const expand_arrow = require('../assets/other_icons/expand_arrow.png');


const SavedScreen = () => {
    const navigation = useNavigation();
    const totalChecks = 10;
    const [inProgressActivities, setInProgressActivities] = useState([]);
    const [completedActivities, setCompletedActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchActivities = async () => {
        // setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:5000/get_saved_activities');
            const fetchedActivities = response.data;
            const inProgress = fetchedActivities.filter(activity => !activity.isCompleted);
            const completed = fetchedActivities.filter(activity => activity.isCompleted);
            setInProgressActivities(inProgress);
            setCompletedActivities(completed);
        } catch (error) {
            console.error('Failed to fetch saved activities:', error);
        } finally {
            setLoading(false); // Hide loading indicator once fetching is done
        }
    };

    const navigateToActivityScreen = (sessionID, savedActivityID) => {
        navigation.navigate('ExpandActivity', { sessionID, savedActivityID });
    };
    const navigateToExpandSavedScreen = (section) => {
        navigation.navigate('ExpandSaved', { section });
    }

    const renderTags = (tagsString, style) => {
        if (tagsString === "any" || tagsString === "") return null;

        const tags = tagsString.split(',').slice(0, 1);
        return tags.map((tag, index) => (
          <View key={index}>
            <Text style={style}>{tag.trim()}</Text>
          </View>
        ));
      };

    useFocusEffect(
        React.useCallback(() => {
            fetchActivities();
            return () => { };
        }, [])
    );
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafc' }}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#000" />
                    <Text style={{ marginTop: 20 }}>Loading activity...</Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    {/* In Progress Section */}
                    <View style={styles.collapsedActivityContainer}>
                        <Text style={styles.sectionTitle}>In Progress</Text>
                        <TouchableOpacity onPress={() => navigateToExpandSavedScreen(true)}>
                            <Image source={expand_arrow}  style={styles.arrowIcon}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.separator} />

                    {inProgressActivities.length > 0 ? (
                        inProgressActivities.slice(0, 3).map((activity, index) => (
                                <View key={index} style={styles.inProgressActivityContainer}>
                                    <View style={{ flex: 1, }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                            <Text style={styles.inProgressTagTitle}>{activity.title}</Text>
                                        </View>
                                        
                                        {/* Progress Bar */}
                                        <View>
                                            <Progress.Bar
                                                style={styles.progressBar}
                                                progress={
                                                    ((Object.values(activity.materialsChecked || {}).filter(value => value).length) + 
                                                    (Object.values(activity.instructionsChecked || {}).filter(value => value).length)) / totalChecks
                                                }
                                                width={225}
                                                color={'#3B3B3B'}
                                                unfilledColor={'#A0A0A0'}
                                                borderWidth={0}
                                                height={4}
                                                borderRadius={0}
                                                marginVertical={5}
                                            />
                                        </View>

                                        <View style={styles.tagContainer}>
                                            {renderTags(activity.typeOfActivity, styles.inProgressTagStyle)}
                                            {renderTags(activity.location, styles.inProgressTagStyle)}
                                            {renderTags(activity.mood, styles.inProgressTagStyle)}
                                            {renderTags(activity.keywords, styles.inProgressTagStyle)}
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => navigateToActivityScreen(activity.sessionID, activity.savedActivityID)}>
                                        <Image source={in_progress_expand_activity} style={styles.expandIcon} />
                                    </TouchableOpacity>
                                </View>
                        ))
                    ) : (
                        <View style={styles.inProgressActivityContainer}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                    <Text style={styles.inProgressTagTitle}>There are no in Progress Activities</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Completed Section */}
                    <View style={styles.collapsedActivityContainer}>
                        <Text style={styles.sectionTitle}>Completed</Text>
                        <TouchableOpacity onPress={() => navigateToExpandSavedScreen(false)}>
                            <Image source={expand_arrow}  style={styles.arrowIcon}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.separator} />

                    {completedActivities.length > 0 ? (
                        completedActivities.slice(0, 3).map((activity, index) => (
                                <View key={index} style={styles.completedActivityContainer}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                            <Text style={styles.completedTagTitle}>{activity.title}</Text>
                                        </View>

                                        <View>
                                            <Text style={styles.dateCompleted}>
                                                {activity.dateCompleted}
                                            </Text>
                                        </View>

                                        <View style={styles.tagContainer}>
                                            {renderTags(activity.typeOfActivity, styles.inProgressTagStyle)}
                                            {renderTags(activity.location, styles.inProgressTagStyle)}
                                            {renderTags(activity.mood, styles.inProgressTagStyle)}
                                            {renderTags(activity.keywords, styles.inProgressTagStyle)}
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => navigateToActivityScreen(activity.sessionID, activity.savedActivityID)}>
                                        <Image source={completed_expand_activity} style={styles.expandIcon} />
                                    </TouchableOpacity>
                                </View>
                        ))
                    ) : (
                        <View style={styles.completedActivityContainer}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                    <Text style={styles.completedTagTitle}>There are no Completed Activities</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 15,
        marginVertical: 12,
    },
    collapsedActivityContainer: {
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
        width: 16,
        height: 16,
    },
    expandIcon: {
        width: 18,
        height: 18,
    },
    inProgressActivityContainer: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        borderRadius: 12,
    },
    tagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    inProgressTagStyle: {
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
    completedTagStyle: {
        fontSize: 10,
        fontFamily: 'Montserrat-Regular',
        color: '#1A1A1A',
        borderColor: '#FBFBFB',
        backgroundColor: '#FBFBFB',
        marginRight: 6,
        paddingHorizontal: 5,
        borderRadius: 3,
        borderWidth: 1,
        overflow: 'hidden',
    },
    completedActivityContainer: {
        backgroundColor: '#373737',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        borderRadius: 12,
    },
    inProgressTagTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 12,
        color: '#1A1A1A'
    },
    completedTagTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 12,
        color: '#FBFBFB'
    },
    dateCompleted: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 8,
        color: '#EDEDED',
    },
    progressBarContainer: {
        paddingTop: 5,
    },
    progressBar: {
        height: 4,
        borderRadius: 0,
        borderColor: '#FFFFFF',
        backgroundColor: '#A0A0A0',
    },

});

export default SavedScreen;
