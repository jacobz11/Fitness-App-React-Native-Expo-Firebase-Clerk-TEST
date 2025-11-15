import { Text, View, Pressable, StyleSheet } from "react-native";
import { Colors } from "../../../constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function ExerciseItem({
  item: exercise,
  index,
  bodyPartId,
  isExerciseSelected,
  toggleExerciseSelection,
}) {
  const selected = isExerciseSelected(bodyPartId, index);

  return (
    <Pressable
      style={[styles.selectBtn, selected && styles.selectBtnActive]}
      onPress={() => toggleExerciseSelection(bodyPartId, index)}
    >
      <View style={styles.checkBoxContainer}>
        <View style={[styles.checkbox, selected && styles.checkboxActive]}>
          {selected && <AntDesign name="check" size={16} color="#fff" />}
        </View>
        <Text
          style={[styles.exerciseName, selected && styles.exerciseTextSelected]}
        >
          {exercise.name}
        </Text>
      </View>
      {/* <Text
        style={[styles.exerciseName, selected && styles.exerciseTextSelected]}
      >
        {exercise.name}
      </Text> */}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  selectBtn: {
    borderColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  selectBtnActive: {
    borderColor: Colors.PRIMARY,
  },
  checkBoxContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 7,
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
    marginTop: 2.485,
  },
  checkboxActive: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  exerciseName: {
    flex: 1,
    fontSize: 17,
    color: "#404040",
    textAlign: "right",
  },
  exerciseTextSelected: {
    fontWeight: "600",
  },
});
