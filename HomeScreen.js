import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Progress from 'react-native-progress';

// Images
const in_progress_expand_activity = require('./assets/in_progress_activity_expand.png');
const completed_expand_activity = require('./assets/completed_activity_expand.png');
const expand_arrow = require('./assets/expand_arrow.png');


const HomeScreen = () => {
  const navigation = useNavigation();
  const totalChecks = 10;
  const [inProgressActivities, setInProgressActivities] = useState([]);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const Separator = () => <View style={styles.separator} />;

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

  const generateQuickPickPrompt = (generateType) => {
    // Default values
    let typeOfActivity = "any";
    let mood = "any";
    let timeOfDay = "any";
    let participants = "any";
    let location = "any";
    let keywords = [];
  
    switch (generateType) {
      case "Explorer":
        console.log("Explorer");
        typeOfActivity = "Exploring,Hiking,Adventure";
        mood = "Energetic,Curious";
        location = "Outdoors,City";
        keywords = ["discovery", "nature", "landmarks"];
        break;
  
      case "Romantic":
        console.log("Romantic");
        typeOfActivity = "Date,Relaxation";
        mood = "Romantic,Intimate";
        timeOfDay = "Evening,Night";
        participants = "2";
        keywords = ["couple", "intimate", "memorable"];
        break;
  
      case "Creator":
        console.log("Creator");
        typeOfActivity = "Art,DIY,Crafts";
        mood = "Inspired,Creative";
        location = "Home,Indoors";
        keywords = ["artistic", "hands-on", "expressive"];
        break;
  
      case "Nightowl":
        console.log("Nightowl");
        typeOfActivity = "Entertainment,Socializing";
        mood = "Energetic,Mysterious";
        timeOfDay = "Night";
        location = "City,Indoors";
        keywords = ["nightlife", "adventure", "urban"];
        break;
  
      case "Gamemaster":
        console.log("Gamemaster");
        typeOfActivity = "Game,Puzzle,Challenge";
        mood = "Playful,Competitive";
        participants = "2,4,6+";
        location = "Home,Indoors";
        keywords = ["strategy", "fun", "interactive"];
        break;
  
      case "Zenmaster":
        console.log("Zenmaster");
        typeOfActivity = "Relaxation,Meditation,Yoga";
        mood = "Calm,Peaceful";
        location = "Home,Outdoors";
        keywords = ["mindfulness", "tranquility", "wellness"];
        break;
  
      default:
        console.log("General");
        // For "general" or any unspecified type, we'll use the default "any" values
        break;
    }
  
    return {
      typeOfActivity,
      timeOfDay,
      participants,
      location,
      mood,
      keywords: keywords.join(", "),
      generateType
    };
  };

  const navigateToActivityScreen = (sessionID, savedActivityID) => {
    navigation.navigate('ExpandActivity', { sessionID, savedActivityID });
  };
  const navigateToExpandSavedScreen = (section) => {
    navigation.navigate('ExpandSaved', { section });
  }
  const handleQuickPick = (generate_type) => {
    const promptObject = generateQuickPickPrompt(generate_type);
    console.log("Navigating with prompt:", promptObject);
    navigation.navigate('Activity', { prompt: promptObject });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchActivities();
      return () => { };
    }, [])
  );

  const renderTags = (tagsString, style) => {
    if (tagsString === "any") return null;

    const tags = tagsString.split(',').slice(0, 1);
    return tags.map((tag, index) => (
      <View key={index}>
        <Text style={style}>{tag.trim()}</Text>
      </View>
    ));
  };  

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#ffff'}}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 20 }}>Loading activity...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => navigation.navigate('Generate')}>
            <View style={[styles.startActivityContainer, styles.dropShadow]}>
              <View>
                <Text style={{ fontFamily: 'Montserrat-SemiBold', color: '#FBFBFB', fontSize: 18, marginBottom: 8}}>Start Activity</Text>
                <Text style={{ fontFamily: 'Montserrat-Regular', color: '#FBFBFB', fontSize: 13,  width: '80%'}}>Tap to Begin Your Next Memorable Adventure!</Text>
              </View>
              <View onPress={() => navigation.navigate('Generate')}>
                <Image source={completed_expand_activity} style={styles.expandIcon} />
              </View>
            </View>
          </TouchableOpacity>

          {/* In Progress Section */}
          <View style={[styles.container, styles.collapsedActivityContainer]}>
            <Text style={[styles.sectionTitle]}>In Progress</Text>
            <TouchableOpacity onPress={() => navigateToExpandSavedScreen(true)}>
              <Image source={expand_arrow} style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.separator} />

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {inProgressActivities.length > 0 ? (
              inProgressActivities.slice(0, 3).map((activity, index) => (
                <View key={activity.savedActivityID} style={[styles.inProgressActivityContainer, styles.dropShadow]}>
                  <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        width={145}
                        color={'#3B3B3B'}
                        unfilledColor={'#A0A0A0'}
                        borderWidth={0}
                        height={4}
                        borderRadius={0}
                        marginVertical={10}
                      />
                    </View>

                    <View style={styles.tagContainer}>
                      {renderTags(activity.typeOfActivity, styles.inProgressTagStyle)}
                      {renderTags(activity.location, styles.inProgressTagStyle)}
                      {renderTags(activity.mood, styles.inProgressTagStyle)}
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => navigateToActivityScreen(activity.sessionID, activity.savedActivityID)}>
                    <Image source={in_progress_expand_activity} style={styles.expandIcon} />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={[styles.noInProgressActivityContainer, styles.dropShadow]}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                    <Text style={styles.inProgressTagTitle}>There are no In Progress Activities</Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>


          {/* Quick Picks Section */}
          <View style={[styles.collapsedActivityContainer, styles.container]}>
            <Text style={styles.sectionTitle}>Quick Picks</Text>
            <TouchableOpacity onPress={() => navigateToExpandSavedScreen(true)}>
              <Image source={expand_arrow} style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>
          <Separator/>

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horizontalScrollView}>
                <TouchableOpacity onPress={() => handleQuickPick("Explorer")} style={[styles.quickPickContainer, styles.dropShadow, {backgroundColor: '#cdbba4'}]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                      <Text style={styles.recommendedTagTitle}>Explorer 🏔️</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleQuickPick("Romantic")} style={[styles.quickPickContainer, styles.dropShadow, {backgroundColor: '#f3c4cf'}]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                      <Text style={styles.recommendedTagTitle}>Romantic 💞</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleQuickPick("Creator")} style={[styles.quickPickContainer, styles.dropShadow, {backgroundColor: '#FFD280'}]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                      <Text style={styles.recommendedTagTitle}>Creator 🎨</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleQuickPick("Nightowl")} style={[styles.quickPickContainer, styles.dropShadow, {backgroundColor: '#AFE1AF'}]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                      <Text style={styles.recommendedTagTitle}>Nightowl 🦉</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleQuickPick("Gamemaster")} style={[styles.quickPickContainer, styles.dropShadow, {backgroundColor: '#AFC0F2'}]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                      <Text style={styles.recommendedTagTitle}>Gamemaster 👾</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleQuickPick("Zenmaster")} style={[styles.quickPickContainer, styles.dropShadow, {backgroundColor: '#fc9e93'}]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                      <Text style={styles.recommendedTagTitle}>Zenmaster 🧘🏻‍♀️</Text>
                    </View>
                </TouchableOpacity>
          </ScrollView>

          {/* Completed Section */}
          <View style={[styles.container, styles.collapsedActivityContainer]}>
            <Text style={styles.sectionTitle}>Completed</Text>
            <TouchableOpacity onPress={() => navigateToExpandSavedScreen(false)}>
              <Image source={expand_arrow} style={styles.arrowIcon}/>
            </TouchableOpacity>
          </View>
          <View style={styles.separator}/>

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {completedActivities.length > 0 ? (
              completedActivities.slice(0, 3).map((activity, index) => (
                <View key={activity.savedActivityID} style={[styles.completedActivityContainer, styles.dropShadow]}>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View>
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
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => navigateToActivityScreen(activity.sessionID, activity.savedActivityID)}>
                    <Image source={completed_expand_activity} style={styles.expandIcon} />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={[styles.noCompletedActivityContainer, styles.dropShadow]}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                    <Text style={styles.completedTagTitle}>There are no Completed Activities</Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
          
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  dropShadowPressed: {
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4
  },
  dropShadow: {
    shadowOffset: {
        width: 0,
        height: 4
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4
  },
  collapsedActivityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#1A1A1A',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 7.5,
    marginVertical: 12,
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
    backgroundColor: '#fafafc',
    height: 90,
    width: 250,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 7.5,
    marginBottom: 15,
    padding: 12,
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
  noInProgressActivityContainer: {
    backgroundColor: '#fafafc',
    height: 90,
    marginHorizontal: 7.5,
    marginBottom: 15,
    padding: 12,
    borderRadius: 12,
  },
  completedTagStyle: {
    fontSize: 10,
    fontFamily: 'Montserrat-Regular',
    color: '#1A1A1A',
    backgroundColor: '#FBFBFB',
    marginRight: 6,
    paddingHorizontal: 5,
    borderColor: '#FBFBFB',
    borderRadius: 3,
    borderWidth: 1,
    overflow: 'hidden',
  },
  completedActivityContainer: {
    backgroundColor: '#373737',
    height: 90,
    width: 250,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 7.5,
    marginBottom: 15,
    padding: 12,
    borderRadius: 12,
  },
  noCompletedActivityContainer: {
    backgroundColor: '#373737',
    height: 90,
    marginHorizontal: 7.5,
    marginBottom: 15,
    padding: 12,
    borderRadius: 12,
  },
  emptySectionText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 15,
  },
  inProgressTagTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#1A1A1A'
  },
  completedTagTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#FBFBFB'
  },
  dateCompleted: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
    marginVertical: 5,
    color: '#EDEDED',
  },
  progressBarContainer: {
    paddingTop: 5,
  },
  startActivityContainer: {
    backgroundColor: '#373737',
    height: 125,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 7.5,
    padding: 12,
    borderRadius: 12,
  },
  progressBar: {
    height: 4,
    borderRadius: 0,
    borderColor: '#FFFFFF',
    backgroundColor: '#A0A0A0',
  },
  horizontalScrollView: {
  },

  //Recommended Section
  quickPickContainer: {
    height: 40,
    width: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 7.5,
    marginBottom: 15,
    padding: 10,
    borderRadius: 12,
  },
  recommendedTagTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
});

export default HomeScreen;