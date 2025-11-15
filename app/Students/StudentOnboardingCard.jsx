import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import { Colors } from "../../constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScrollView } from "react-native-virtualized-view";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function StudentOnboardingCard({
  item,
  birthday,
  setBirthday,
  selectedGoals,
  toggleGoalSelection,
}) {
  const { width } = useWindowDimensions();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGoalsDropdown, setShowGoalsDropdown] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setShowDatePicker(Platform.OS === "ios");
    setBirthday(currentDate);
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isGoalSelected = (goal) => {
    return selectedGoals.includes(goal);
  };

  const getSelectedGoalsText = () => {
    if (selectedGoals.length === 0) {
      return strings.selectGoals;
    }
    if (selectedGoals.length === 1) {
      return selectedGoals[0];
    }
    return `${selectedGoals.length} ${strings.goalsSelected}`;
  };

  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.contentContainer}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item?.imgUrl }}
            style={styles.img}
            resizeMode="contain"
          />
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item?.title}</Text>
          <Text style={styles.description}>{item?.description}</Text>

          {/* Birthday Input */}
          {item?.name && (
            <View style={styles.birthdayContainer}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>{formatDate(birthday)}</Text>
                <MaterialIcons
                  name="edit-calendar"
                  size={20}
                  color={Colors.PRIMARY}
                />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={birthday}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                />
              )}
            </View>
          )}

          {/* Goals Dropdown Button */}
          {item?.goals && (
            <View style={styles.goalsContainer}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowGoalsDropdown(true)}
              >
                <AntDesign
                  name="down"
                  size={16}
                  color={selectedGoals.length > 0 ? Colors.PRIMARY : "#404040"}
                />
                <Text
                  style={[
                    styles.dropdownButtonText,
                    selectedGoals.length > 0 && styles.dropdownButtonTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {getSelectedGoalsText()}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Goals Dropdown Modal */}
      <Modal
        visible={showGoalsDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGoalsDropdown(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowGoalsDropdown(false)}
        >
          <Pressable
            style={styles.dropdownContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.dropdownHeader}>
              <TouchableOpacity
                onPress={() => setShowGoalsDropdown(false)}
                style={styles.closeButton}
              >
                <AntDesign name="close" size={24} color="#404040" />
              </TouchableOpacity>
              <Text style={styles.dropdownTitle}>{strings.chooseGoals}</Text>
            </View>

            <ScrollView
              style={styles.dropdownScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.dropdownScrollContent}
            >
              {item?.goals?.split(". ").map((goal, index) => {
                const selected = isGoalSelected(goal);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.selectBtn,
                      selected && styles.selectBtnActive,
                    ]}
                    onPress={() => toggleGoalSelection(goal)}
                  >
                    <View style={styles.checkboxContainer}>
                      <View
                        style={[
                          styles.checkbox,
                          selected && styles.checkboxActive,
                        ]}
                      >
                        {selected && (
                          <AntDesign name="check" size={16} color="#fff" />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.selectTxt,
                          selected && styles.selectTxtActive,
                        ]}
                      >
                        {goal}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowGoalsDropdown(false)}
            >
              <Text style={styles.doneButtonText}>{strings.done}</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const strings = {
  selectGoals: "בחר/י מטרות",
  goalsSelected: "מטרות נבחרו",
  chooseGoals: "בחירת מטרות",
  done: "סיום",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: hp(15),
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  img: {
    width: wp(55),
    height: hp(28),
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    maxWidth: "100%",
  },
  title: {
    fontWeight: "700",
    fontSize: 26,
    textAlign: "center",
    color: "#404040",
    lineHeight: 32,
  },
  description: {
    fontWeight: "400",
    color: "#62656b",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 30,
  },
  birthdayContainer: {
    width: "100%",
    alignItems: "center",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minWidth: wp(42),
  },
  dateText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#404040",
    flex: 1,
  },
  goalsContainer: {
    width: "100%",
    alignItems: "center",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minWidth: wp(70),
    gap: 8,
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#404040",
    textAlign: "center",
    flex: 1,
  },
  dropdownButtonTextActive: {
    color: Colors.PRIMARY,
    fontWeight: "600",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: wp(85),
    maxHeight: hp(70),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderSecondary,
  },
  dropdownTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#404040",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    padding: 5,
  },
  dropdownScrollView: {
    maxHeight: hp(50),
  },
  dropdownScrollContent: {
    padding: 20,
    paddingBottom: 10,
  },
  selectBtn: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  selectBtnActive: {
    borderColor: Colors.PRIMARY,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxActive: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  selectTxt: {
    fontSize: 16,
    color: "#404040",
    flex: 1,
    textAlign: "right",
  },
  selectTxtActive: {
    fontWeight: "600",
  },
  doneButton: {
    backgroundColor: Colors.PRIMARY,
    margin: 20,
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
