import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  View,
  Text,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import './stylesheet.css'
const numColumns = 3;
const buttonMargin = 5;
const buttonSize = ((Dimensions.get('window').width - buttonMargin * (numColumns * 2)) / numColumns) * 0.55;
const windowHeight = Dimensions.get('window').height;

const TYPEOFACTIVITY = [
  {
    id: "101",
    img: require("./assets/nature_icon.png"),
    title: "Art",
    dataType: "activity",
    selected: false,
  },
  {
    id: "102",
    img: require("./assets/nature_icon.png"),
    title: "DIY",
    dataType: "activity",
    selected: false,
  },
  {
    id: "103",
    img: require("./assets/nature_icon.png"),
    title: "Exploring",
    dataType: "activity",
    selected: false,
  },
  {
    id: "104",
    img: require("./assets/nature_icon.png"),
    title: "Game",
    dataType: "activity",
    selected: false,
  },
  {
    id: "105",
    img: require("./assets/nature_icon.png"),
    title: "Date",
    dataType: "activity",
    selected: false,
  },
  {
    id: "106",
    img: require("./assets/nature_icon.png"),
    title: "Sports",
    dataType: "activity",
    selected: false,
  },
  {
    id: "107",
    img: require("./assets/nature_icon.png"),
    title: "Drinking",
    dataType: "activity",
    selected: false,
  },
];

const TIMEOFDAY = [
  {
    id: "200",
    img: require("./assets/nature_icon.png"),
    title: "Morning",
    dataType: "time-of-day",
    selected: false,
  },
  {
    id: "201",
    img: require("./assets/nature_icon.png"),
    title: "Afternoon",
    dataType: "time-of-day",
    selected: false,
  },
  {
    id: "202",
    img: require("./assets/nature_icon.png"),
    title: "Evening",
    dataType: "time-of-day",
    selected: false,
  },
  {
    id: "203",
    img: require("./assets/nature_icon.png"),
    title: "Night",
    dataType: "time-of-day",
    selected: false,
  },
];

const PARTICIPANTS = [
  {
    id: "300",
    img: require("./assets/nature_icon.png"),
    title: "1",
    dataType: "participants",
    selected: false,
  },
  {
    id: "301",
    img: require("./assets/nature_icon.png"),
    title: "2",
    dataType: "participants",
    selected: false,
  },
  {
    id: "302",
    img: require("./assets/nature_icon.png"),
    title: "3",
    dataType: "participants",
    selected: false,
  },
  {
    id: "303",
    img: require("./assets/nature_icon.png"),
    title: "4",
    dataType: "participants",
    selected: false,
  },
  {
    id: "304",
    img: require("./assets/nature_icon.png"),
    title: "5",
    dataType: "participants",
    selected: false,
  },
  {
    id: "305",
    img: require("./assets/nature_icon.png"),
    title: "6",
    dataType: "participants",
    selected: false,
  },
];

const LOCATION = [
  {
    id: "400",
    img: require("./assets/nature_icon.png"),
    title: "Home",
    dataType: "location",
    selected: false,
  },
  {
    id: "401",
    img: require("./assets/nature_icon.png"),
    title: "Nature",
    dataType: "location",
    selected: false,
  },
  {
    id: "402",
    img: require("./assets/nature_icon.png"),
    title: "City",
    dataType: "location",
    selected: false,
  },
  {
    id: "403",
    img: require("./assets/nature_icon.png"),
    title: "Party",
    dataType: "location",
    selected: false,
  },
];

const MOOD = [
  {
    id: "500",
    img: require("./assets/nature_icon.png"),
    title: "Energetic",
    dataType: "mood",
    selected: false,
  },
  {
    id: "501",
    img: require("./assets/nature_icon.png"),
    title: "Calm",
    dataType: "mood",
    selected: false,
  },
  {
    id: "502",
    img: require("./assets/nature_icon.png"),
    title: "Curious",
    dataType: "mood",
    selected: false,
  },
  {
    id: "503",
    img: require("./assets/nature_icon.png"),
    title: "Brave",
    dataType: "mood",
    selected: false,
  },
  {
    id: "504",
    img: require("./assets/nature_icon.png"),
    title: "Romantic",
    dataType: "mood",
    selected: false,
  },
];

const Separator = () => <View style={styles.separator} />;

const ItemButton = ({
  img,
  onPress,
  isSelected,
  title,
  isParticipant,
  dataType,
}) => (
  <TouchableOpacity onPress={onPress} style={styles.touchable}>
    <View
      style={[
        isParticipant ? [styles.buttonParticipant, styles.shadow] : [styles.button, styles.shadow],
        {
          borderColor: isSelected ? "#2b2b2b" : "#fff",
        },
      ]}
    >
      {dataType === "participants" ? (
        <Text style={styles.participantText}>{title}</Text>
      ) : (
        <Image source={img} style={styles.image} />
      )}
    </View>
    {dataType !== "participants" && <Text style={styles.title}>{title}</Text>}
  </TouchableOpacity>
);

const GenerateScreen = () => {
  const combinedData = [
    ...TYPEOFACTIVITY,
    ...TIMEOFDAY,
    ...PARTICIPANTS,
    ...LOCATION,
    ...MOOD,
  ];
  const navigation = useNavigation();

  const dataHashMap = combinedData.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState(dataHashMap);
  const selectedItems = Object.values(selectedData).filter(
    (item) => item.selected
  );

  const handleButtonClick = (id) => {
    console.log("Pressed button with id:", id);
    setSelectedData((prevState) => {
      const updatedItem = {
        ...prevState[id],
        selected: !prevState[id].selected,
      };

      let updatedState = { ...prevState, [id]: updatedItem };

      const handleSingleSelection = (dataType) => {
        if (dataType.map((item) => item.id).includes(id)) {
          dataType.forEach((item) => {
            if (item.id !== id) {
              updatedState[item.id].selected = false;
            }
          });
        }
      };

      if (updatedItem.dataType === "time-of-day") {
        handleSingleSelection(TIMEOFDAY);
      } else if (updatedItem.dataType === "participants") {
        handleSingleSelection(PARTICIPANTS);
      } else if (updatedItem.dataType === "location") {
        handleSingleSelection(LOCATION);
      }

      return updatedState;
    });
  };

  const generatePrompt = () => {
    const activities = selectedItems
      .filter(item => item.dataType === "activity")
      .map(item => item.title)
      .join(", "); // Join multiple activities into a string

    const moods = selectedItems
      .filter(item => item.dataType === "mood")
      .map(item => item.title)
      .join(", "); // Join multiple moods into a string

    const timeOfDay = selectedItems.find(item => item.dataType === "time-of-day")?.title || "any";
    const participants = selectedItems.find(item => item.dataType === "participants")?.title || "any";
    const location = selectedItems.find(item => item.dataType === "location")?.title || "any";

    return {
      typeOfActivity: activities || "any",
      timeOfDay,
      participants,
      location,
      mood: moods || "any"
    };
  };

  const navigateToActivityScreen = () => {
    const promptObject = generatePrompt();
    navigation.navigate('Activity', { prompt: promptObject });
  };

  const renderItem = ({ item }) => {
    const { id, img, title, dataType } = item;
    const selected = selectedData[id].selected;
    return (
      <ItemButton
        key={id}
        id={id}
        img={img}
        onPress={() => handleButtonClick(id)}
        isSelected={selected}
        title={title}
        isParticipant={dataType === "participants"}
        dataType={dataType}
      />
    );
  };
  console.log("Selected items:", selectedItems);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafc' }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Add a modal for the loading screen */}
        <Modal visible={loading} transparent={true} animationType="fade">
          <View style={styles.loadingContainer}>
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={styles.loadingText}>Generating...</Text>
            </View>
        </View>
        </Modal>
        <View style={{ paddingVertical: 12, paddingHorizontal: 5 }}>

          <View>
            <Text style={styles.rowTitle}>Select the type of activity</Text>
            <View style={{ alignItems: "center" }}>
              <View style={styles.grid}>
                {TYPEOFACTIVITY.map((item) => renderItem({ item }))}
              </View>
            </View>
          </View>

          <Separator />
          <View>
            <Text style={styles.rowTitle}>Time of day</Text>
            <View style={styles.grid}>
              {TIMEOFDAY.map((item) => renderItem({ item }))}
            </View>
          </View>

          <Separator />
          <View>
            <Text style={styles.rowTitle}>Partcipants</Text>
            <View style={styles.grid}>
              {PARTICIPANTS.map((item) => renderItem({ item }))}
            </View>
          </View>

          <Separator />
          <View>
            <Text style={styles.rowTitle}>Location</Text>
            <View style={styles.grid}>
              {LOCATION.map((item) => renderItem({ item }))}
            </View>
          </View>

          <Separator />
          <View>
            <Text style={styles.rowTitle}>Mood</Text>
            <View style={styles.grid}>
              {MOOD.map((item) => renderItem({ item }))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={navigateToActivityScreen}
          style={[styles.generateButton,]}
        >
          <Text style={[styles.generateButtonText]}>
            Generate Activity
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  touchable: {
    margin: buttonMargin,
  },
  buttonContainer: {
    padding: 10, 
    alignItems: 'center', 
    borderTopWidth: 0.3,
    borderColor: '#fff',
    backgroundColor: '#fafafc',
  },
  generateButton: {
    backgroundColor: "#2b2b2b",
    borderRadius: 15,
    paddingVertical: 10,
    alignSelf: 'stretch',
  },
  generateButtonText: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    color: "#fff",
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: buttonSize / 3,
  },
  innerShadow: {
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
  },
  dropShadow: {
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
  },
  buttonParticipant: {
    width: buttonSize * 0.8,
    height: buttonSize * 0.8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: buttonSize / 2,
  },
  participantText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Montserrat-SemiBold',
  },
  image: {
    width: buttonSize * 0.6,
    height: buttonSize * 0.6,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
    marginVertical: 12,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 10,
    fontFamily: 'Montserrat-Medium',
  },
  scrolling: {
    snapToInterval: { windowHeight },
    decelerationRate: 'slow',
    showsHorizontalScrollIndicator: false,
  },

  //Loading Screen
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingContent: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GenerateScreen;