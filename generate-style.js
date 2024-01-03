import {StyleSheet, Dimensions} from 'react-native';
const numColumns = 3;
const buttonMargin = 5;
const buttonSize = ((Dimensions.get('window').width - buttonMargin * (numColumns * 2)) / numColumns) * 0.55;
const windowHeight = Dimensions.get('window').height;

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
      color: '#fff',
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
        color: "fff",
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
  export default styles;