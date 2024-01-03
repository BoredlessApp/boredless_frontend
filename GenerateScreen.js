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

const numColumns = 3;
const buttonMargin = 5;
const buttonSize = ((Dimensions.get('window').width - buttonMargin * (numColumns * 2)) / numColumns) * 0.55;
const windowHeight = Dimensions.get('window').height;


// Constants for different type of activities, times of day, participants, and location
const TYPEOFACTIVITY = [
  {
    id: "101",
    img: require("./assets/icons8-tree-64.png"),
    title: "Art",
    dataType: "activity",
    selected: false,
  },
  {
    id: "102",
    img: require("./assets/icons8-tree-64.png"),
    title: "DIY",
    dataType: "activity",
    selected: false,
  },
  {
    id: "103",
    img: require("./assets/icons8-tree-64.png"),
    title: "Exploring",
    dataType: "activity",
    selected: false,
  },
  {
    id: "104",
    img: require("./assets/icons8-tree-64.png"),
    title: "Game",
    dataType: "activity",
    selected: false,
  },
  {
    id: "105",
    img: require("./assets/icons8-tree-64.png"),
    title: "Date",
    dataType: "activity",
    selected: false,
  },
  {
    id: "106",
    img: require("./assets/icons8-tree-64.png"),
    title: "Sports",
    dataType: "activity",
    selected: false,
  },
  {
    id: "107",
    img: require("./assets/icons8-tree-64.png"),
    title: "Drinking",
    dataType: "activity",
    selected: false,
  },
];

const TIMEOFDAY = [
  {
    id: "200",
    img: require("./assets/icons8-tree-64.png"),
    title: "Morning",
    dataType: "time-of-day",
    selected: false,
  },
  {
    id: "201",
    img: require("./assets/icons8-tree-64.png"),
    title: "Afternoon",
    dataType: "time-of-day",
    selected: false,
  },
  {
    id: "202",
    img: require("./assets/icons8-tree-64.png"),
    title: "Evening",
    dataType: "time-of-day",
    selected: false,
  },
  {
    id: "203",
    img: require("./assets/icons8-tree-64.png"),
    title: "Night",
    dataType: "time-of-day",
    selected: false,
  },
];

const PARTICIPANTS = [
  {
    id: "300",
    img: require("./assets/icons8-tree-64.png"),
    title: "1",
    dataType: "participants",
    selected: false,
  },
  {
    id: "301",
    img: require("./assets/icons8-tree-64.png"),
    title: "2",
    dataType: "participants",
    selected: false,
  },
  {
    id: "302",
    img: require("./assets/icons8-tree-64.png"),
    title: "3",
    dataType: "participants",
    selected: false,
  },
  {
    id: "303",
    img: require("./assets/icons8-tree-64.png"),
    title: "4",
    dataType: "participants",
    selected: false,
  },
  {
    id: "304",
    img: require("./assets/icons8-tree-64.png"),
    title: "5",
    dataType: "participants",
    selected: false,
  },
  {
    id: "305",
    img: require("./assets/icons8-tree-64.png"),
    title: "6",
    dataType: "participants",
    selected: false,
  },
];

const LOCATION = [
  {
    id: "400",
    img: require("./assets/icons8-tree-64.png"),
    title: "Outdoors",
    dataType: "location",
    selected: false,
  },
  {
    id: "401",
    img: require("./assets/icons8-tree-64.png"),
    title: "Indoors",
    dataType: "location",
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
        isParticipant ? styles.buttonParticipant : styles.button,
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

// The main component for GenerateScreen
const GenerateScreen = () => {
  // Merge all data into one array and create a hash map out of them
  const combinedData = [
    ...TYPEOFACTIVITY,
    ...TIMEOFDAY,
    ...PARTICIPANTS,
    ...LOCATION,
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
      const typeOfActivity = selectedItems.find(
          (item) => item.dataType === "activity"
      );
      const timeOfDay = selectedItems.find(
          (item) => item.dataType === "time-of-day"
      );
      const participants = selectedItems.find(
          (item) => item.dataType === "participants"
      );
      const location = selectedItems.find((item) => item.dataType === "location");

      return `Type of activity: ${typeOfActivity ? typeOfActivity.title : "any"}, 
              Time of day: ${timeOfDay ? timeOfDay.title : "any"}, 
              Participants: ${participants ? participants.title : "any"}, 
              Location: ${location ? location.title : "any"}`;
  };

  const navigateToActivityScreen = () => {
    const prompt = generatePrompt();
    navigation.navigate('Activity', { prompt });
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
    <SafeAreaView style={{ flex: 1 }}>
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
        <View style={{ paddingVertical: 12, paddingHorizontal: 5}}>
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
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={navigateToActivityScreen}
          style={{
            backgroundColor: "#2b2b2b",
            borderRadius: 10,
            paddingHorizontal: 120,
            paddingVertical: 15,
            elevation: 5,
          }}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>
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
    padding: 10,  // Adds space on the sides and vertical padding
    alignItems: 'center',  // Centers the button horizontally
    borderTopWidth: 0.3,
    borderColor: '#ccc',
  },
  generateButton: {
      backgroundColor: "#2b2b2b",
      borderRadius: 15,
      paddingVertical: 20,
      elevation: 5,
      alignSelf: 'stretch',  // Makes the button stretch to fill its container, which has padding
  },
  generateButtonText: {
      fontWeight: "bold",
      fontSize: 20,
      color: "#fff",
      textAlign: 'center',  // Centers the text inside the button
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
  buttonParticipant: {
    width: buttonSize * 0.8,
    height: buttonSize * 0.8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: buttonSize / 2,
  },
  participantText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  image: {
    width: buttonSize * 0.6,
    height: buttonSize * 0.6,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
    marginVertical: 12,
  },
  rowTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 10
  },
  scrolling: {
    snapToInterval: {windowHeight},
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