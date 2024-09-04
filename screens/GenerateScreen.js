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
  Dimensions,
  TextInput
} from "react-native";
import { useNavigation } from "@react-navigation/native";
const numColumns = 3;
const buttonMargin = 5;
const buttonSize = ((Dimensions.get('window').width - buttonMargin * (numColumns * 2)) / numColumns) * 0.55;
const windowHeight = Dimensions.get('window').height;

const TYPEOFACTIVITY = [
  {
    id: "100",
    img: require("../assets/generate_page_icons/art.png"),
    title: "Art",
    dataType: "activity",
    selected: false,
  },
  {
    id: "101",
    img: require("../assets/generate_page_icons/DIY.png"),
    title: "DIY",
    dataType: "activity",
    selected: false,
  },
  {
    id: "102",
    img: require("../assets/generate_page_icons/exploring.png"),
    title: "Exploring",
    dataType: "activity",
    selected: false,
  },
  {
    id: "103",
    img: require("../assets/generate_page_icons/game.png"),
    title: "Game",
    dataType: "activity",
    selected: false,
  },
  {
    id: "104",
    img: require("../assets/generate_page_icons/date.png"),
    title: "Date",
    dataType: "activity",
    selected: false,
  },
  {
    id: "105",
    img: require("../assets/generate_page_icons/sports.png"),
    title: "Sports",
    dataType: "activity",
    selected: false,
  },
  {
    id: "106",
    img: require("../assets/generate_page_icons/drinking.png"),
    title: "Drinking",
    dataType: "activity",
    selected: false,
  },
];

const TIMEOFDAY = [
  {
    id: "200",
    img: require("../assets/generate_page_icons/morning.png"),
    title: "Morning",
    dataType: "time-of-day",
    selected: false,
  },
  {
    id: "201",
    img: require("../assets/generate_page_icons/afternoon.png"),
    title: "Afternoon",
    dataType: "time-of-day",
    selected: false,
  },
  {
    id: "202",
    img: require("../assets/generate_page_icons/evening.png"),
    title: "Evening",
    dataType: "time-of-day",
    selected: false,
  },
  {
    id: "203",
    img: require("../assets/generate_page_icons/night.png"),
    title: "Night",
    dataType: "time-of-day",
    selected: false,
  },
];

const PARTICIPANTS = [
  {
    id: "300",
    img: require("../assets/generate_page_icons/nature_icon.png"),
    title: "1",
    dataType: "participants",
    selected: false,
  },
  {
    id: "301",
    img: require("../assets/generate_page_icons/nature_icon.png"),
    title: "2",
    dataType: "participants",
    selected: false,
  },
  {
    id: "302",
    img: require("../assets/generate_page_icons/nature_icon.png"),
    title: "3",
    dataType: "participants",
    selected: false,
  },
  {
    id: "303",
    img: require("../assets/generate_page_icons/nature_icon.png"),
    title: "4",
    dataType: "participants",
    selected: false,
  },
  {
    id: "304",
    img: require("../assets/generate_page_icons/nature_icon.png"),
    title: "5",
    dataType: "participants",
    selected: false,
  },
  {
    id: "305",
    img: require("../assets/generate_page_icons/nature_icon.png"),
    title: "6+",
    dataType: "participants",
    selected: false,
  },
];

const LOCATION = [
  {
    id: "400",
    img: require("../assets/generate_page_icons/home.png"),
    title: "Home",
    dataType: "location",
    selected: false,
  },
  {
    id: "401",
    img: require("../assets/generate_page_icons/city.png"),
    title: "City",
    dataType: "location",
    selected: false,
  },
  {
    id: "402",
    img: require("../assets/generate_page_icons/indoors.png"),
    title: "Indoors",
    dataType: "location",
    selected: false,
  },
  {
    id: "403",
    img: require("../assets/generate_page_icons/outdoors.png"),
    title: "Outdoors",
    dataType: "location",
    selected: false,
  },
  {
    id: "404",
    img: require("../assets/generate_page_icons/virtual.png"),
    title: "Virtual",
    dataType: "location",
    selected: false,
  },
];

const MOOD = [
  {
    id: "500",
    img: require("../assets/generate_page_icons/energetic.png"),
    title: "Energetic",
    dataType: "mood",
    selected: false,
  },
  {
    id: "501",
    img: require("../assets/generate_page_icons/relaxed.png"),
    title: "Relaxed",
    dataType: "mood",
    selected: false,
  },
  {
    id: "502",
    img: require("../assets/generate_page_icons/playful.png"),
    title: "Playful",
    dataType: "mood",
    selected: false,
  },
  {
    id: "503",
    img: require("../assets/generate_page_icons/inspired.png"),
    title: "Inspired",
    dataType: "mood",
    selected: false,
  },
  {
    id: "504",
    img: require("../assets/generate_page_icons/mysterious.png"),
    title: "Mysterious",
    dataType: "mood",
    selected: false,
  },
  {
    id: "505",
    img: require("../assets/generate_page_icons/romantic.png"),
    title: "Romantic",
    dataType: "mood",
    selected: false,
  },
  {
    id: "506",
    img: require("../assets/generate_page_icons/nostalgic.png"),
    title: "Nostalgic",
    dataType: "mood",
    selected: false
  },
];
const BUDGET = [
  {
    id: "600",
    img: require("../assets/generate_page_icons/nature_icon.png"),
    title: "$",
    dataType: "budget",
    selected: false,
  },
  {
    id: "601",
    img: require("../assets/generate_page_icons/nature_icon.png"),
    title: "$$",
    dataType: "budget",
    selected: false,
  },
  {
    id: "602",
    img: require("../assets/generate_page_icons/nature_icon.png"),
    title: "$$$",
    dataType: "budget",
    selected: false,
  }
];
const RELATIONTYPE = [
  {
    id: "700",
    img: require("../assets/generate_page_icons/nature_icon.png"),
    title: "Friends",
    dataType: "relation-type",
    selected: false,
  },
  {
    id: "701",
    img: require("../assets/generate_page_icons/nature_icon.png"),
    title: "Family",
    dataType: "relation-type",
    selected: false,
  },
  {
    id: "702",
    img: require("../assets/generate_page_icons/nature_icon.png"),
    title: "Colleagues",
    dataType: "relation-type",
    selected: false,
  },
  {
    id: "703",
    img: require("../assets/generate_page_icons/nature_icon.png"),
    title: "Romantic",
    dataType: "relation-type",
    selected: false,
  }
];

const Separator = () => <View style={styles.separator} />;

const ItemButton = ({ img, onPress, isSelected, title, isParticipant, dataType }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={1} // Disables the fading effect by setting opacity to 100%
      style={styles.touchable}
    >
      <View
        style={[
          isParticipant ? styles.buttonParticipant : styles.button,
          isPressed ? styles.dropShadowPressed : styles.dropShadow,
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
};

const GenerateScreen = () => {
  const combinedData = [
    ...TYPEOFACTIVITY,
    ...TIMEOFDAY,
    ...PARTICIPANTS,
    ...LOCATION,
    ...MOOD,
      ];
  const navigation = useNavigation();

  const [dataHashMap, setDataHashMap] = useState(() => 
    combinedData.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {})
  );
  
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [keywordValue, setKeywordValue] = useState("");
  const [selectedData, setSelectedData] = useState(dataHashMap);
  const [errorMessage, setErrorMessage] = useState("");
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

  const addKeyword = (keyword) => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      // Check for special characters and numbers
      if (/^[a-zA-Z\s]+$/.test(trimmedKeyword)) {
        // Capitalize the first letter
        const capitalizedKeyword = trimmedKeyword.charAt(0).toUpperCase() + trimmedKeyword.slice(1).toLowerCase();
        
        // Check for duplicates
        if (keywords.map(k => k.toLowerCase()).includes(capitalizedKeyword.toLowerCase())) {
          setErrorMessage("This keyword has already been added.");
          return false;
        } else {
          setKeywords((prevKeywords) => [capitalizedKeyword, ...prevKeywords]);
          setErrorMessage(""); // Clear any existing error message
          return true;
        }
      } else {
        setErrorMessage("Keywords should only contain letters and spaces.");
        return false;
      }
    } else {
      setErrorMessage("Please enter a valid keyword.");
      return false;
    }
  };

  const handleKeywordPress = (text) => {
    if (text.endsWith(' ')) {
      // Space was pressed
      if (keywordValue.trim()) {
        // Try to add the current keyword
        if (addKeyword(keywordValue)) {
          // If successful, clear the input field
          setKeywordValue('');
        }
      }
    } else {
      // Update the input value normally
      setKeywordValue(text);
    }
  };

  const handleCustomKeyword = () => {
    if (addKeyword(keywordValue)) {
      setKeywordValue(''); // Clear the input field after adding the keyword
    }
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
      mood: moods || "any",
      keywords: keywords.join(", ") 
    };
  };

  const clearSelections = () => {
    setSelectedData((prevState) => {
      const clearedState = {};
      for (const key in prevState) {
        clearedState[key] = { ...prevState[key], selected: false };
      }
      return clearedState;
    });
    setKeywords([]);
    setKeywordValue("");
  };

  const navigateToActivityScreen = () => {
    const promptObject = generatePrompt();
    console.log("Navigating with prompt:", promptObject);
    navigation.navigate('Activity', { prompt: promptObject });
    clearSelections();
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
  console.log("Selected items:", selectedItems, "Keywords:", keywords);

  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords((prevKeywords) => prevKeywords.filter(keyword => keyword !== keywordToRemove));
  };

  const renderKeywordsTags = () => {
    const tags = keywords.slice(0, 3);
    return tags.map((tag, index) => (
      <TouchableOpacity 
        key={index} 
        style={styles.keywordTagStyle}
        onPress={() => handleRemoveKeyword(tag)}
      >
        <Text style={styles.keywordTagText}>
          {tag.trim()} <Text style={{fontWeight: 'bold'}}>×</Text>
        </Text>
      </TouchableOpacity>
    ));
  };

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

          <Separator />
          <View>
            <Text style={styles.rowTitle}>Custom Keywords</Text>
            <View style={styles.customInputContainer}>
              <TextInput
                style={styles.customInputField}
                placeholder="Write keywords for your activity"
                onChangeText={handleKeywordPress}
                value={keywordValue}
                onSubmitEditing={handleCustomKeyword}
                blurOnSubmit={false}
              />
              <TouchableOpacity 
                onPress={handleCustomKeyword}
                style={[styles.addButton, styles.dropShadow]}
              >
                <Text style={[styles.addButtonText]}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
            <View style={styles.tagContainer}>
              {renderKeywordsTags()}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={navigateToActivityScreen}
          style={[styles.generateButton, styles.dropShadow]}
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
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
    marginLeft: 10,
    maxWidth: '70%',
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
    borderWidth: 0.5,
    borderRadius: buttonSize / 3,
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
  customInputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5, 
    alignItems: 'left',
  },
  customInputField: {
    backgroundColor: "#fff",
    borderWidth: 0.4,
    borderColor: "#292D32",
    borderRadius: 15,
    padding: 10,
    height: 46,
    minWidth: '70%'
  },
  addButtonText: {
    flexDirection: 'row',
    color: "#404040",
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#EAEAEA",
    borderRadius: 15,
    marginLeft: 16,
    justifyContent: 'center',
    height: 46,
    minWidth: '18%'
  },
  keywordTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeKeywordButton: {
    marginRight: 5,
  },
  removeKeywordText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
  keywordTagStyle: {
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
  keywordTagText: {
    fontSize: 10,
    fontFamily: 'Montserrat-Regular',
    color: '#1A1A1A'
  },
  errorMessage: {
    color: 'red',
    fontSize: 10,
    marginTop: 2,
    marginLeft: 10,
    fontFamily: 'Montserrat-Regular',
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