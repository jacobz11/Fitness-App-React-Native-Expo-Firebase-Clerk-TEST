import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../../../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { FlatList } from "react-native";
import { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ExerciseItem from "./ExerciseItem";

export default function BodyPartItem({
  item: bodyPart,
  selectedExercises,
  setSelectedExercises,
}) {
  const [expandedSections, setExpandedSections] = useState({});

  const isExerciseSelected = (bodyPartId, exerciseIndex) => {
    return selectedExercises[bodyPartId]?.includes(exerciseIndex) || false;
  };

  const toggleSection = (bodyPartId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [bodyPartId]: !prev[bodyPartId],
    }));
  };

  const toggleExerciseSelection = (bodyPartId, exerciseIndex) => {
    setSelectedExercises((prev) => {
      const currentExercises = prev[bodyPartId] || [];

      if (currentExercises.includes(exerciseIndex)) {
        // Remove index from array
        const updatedExercises = currentExercises.filter(
          (idx) => idx !== exerciseIndex
        );

        if (updatedExercises.length === 0) {
          // Remove bodyPartId key if no exercises left
          const { [bodyPartId]: removed, ...rest } = prev;
          return rest;
        } else {
          return {
            ...prev,
            [bodyPartId]: updatedExercises,
          };
        }
      } else {
        // Add index to array
        return {
          ...prev,
          [bodyPartId]: [...currentExercises, exerciseIndex],
        };
      }
    });
  };

  return (
    <View style={styles.bodyPartSection}>
      <TouchableOpacity
        style={styles.bodyPartHeader}
        onPress={() => toggleSection(bodyPart.id)}
      >
        <MaterialIcons
          name={
            expandedSections[bodyPart.id]
              ? "keyboard-arrow-up"
              : "keyboard-arrow-down"
          }
          size={24}
          color={Colors.PRIMARY}
        />
        <View style={styles.bodyPartTitleContainer}>
          <View>
            {selectedExercises[bodyPart.id]?.length > 0 && (
              <Text style={styles.exerciseCount}>
                {selectedExercises[bodyPart.id].length}
              </Text>
            )}
          </View>
          <View>
            <Text style={styles.bodyPartTitle}>{bodyPart.bodyPart}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {expandedSections[bodyPart.id] && (
        <View style={styles.exercisesList}>
          {bodyPart.exercises && bodyPart.exercises.length > 0 ? (
            <FlatList
              data={bodyPart.exercises}
              renderItem={({ item: exercise, index }) => (
                <ExerciseItem
                  item={exercise}
                  index={index}
                  bodyPartId={bodyPart.id}
                  isExerciseSelected={isExerciseSelected}
                  toggleExerciseSelection={toggleExerciseSelection}
                />
              )}
              keyExtractor={(exercise, index) => `${bodyPart.id}-${index}`}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noExercises}>{strings.noExercises}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const strings = {
  noExercises: "אין תרגילים זמינים",
};

const styles = StyleSheet.create({
  bodyPartSection: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  bodyPartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  bodyPartTitleContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 5,
  },
  bodyPartTitle: {
    fontSize: hp(2.5),
    fontWeight: "600",
    color: "#404040",
    flex: 1,
    textAlign: "right",
    marginRight: 10,
  },
  exerciseCount: {
    fontSize: hp(2.2),
    fontWeight: "700",
    color: Colors.PRIMARY,
  },
  exercisesList: {
    padding: 15,
    paddingTop: 10,
  },
  noExercises: {
    fontSize: hp(2),
    color: "#999",
    textAlign: "center",
    paddingVertical: 10,
  },
});
