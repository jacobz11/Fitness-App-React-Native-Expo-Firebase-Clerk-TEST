import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../configs/FirebaseConfig";
import { Colors } from "../../../constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function StudentPreferences({ userId }) {
  const [loading, setLoading] = useState(true);
  const [boardingData, setBoardingData] = useState(null);

  useEffect(() => {
    if (userId) {
      LoadBoardingData();
    }
  }, [userId]);

  const LoadBoardingData = async () => {
    try {
      setLoading(true);
      const userRef = doc(db, "Users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.boarding) {
          setBoardingData(userData.boarding);
        }
      }
    } catch (error) {
      console.error("Error loading boarding data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (!boardingData) {
    return null;
  }

  // Calculate age from birthday
  const calculateAge = (birthdayString) => {
    if (!birthdayString) return null;

    // Parse DD/MM/YYYY format
    const [day, month, year] = birthdayString.split("/").map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    const years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();
    const days = today.getDate() - birthDate.getDate();

    // Calculate precise age
    let ageYears = years;
    let ageMonths = months;

    if (days < 0) {
      ageMonths--;
    }

    if (ageMonths < 0) {
      ageYears--;
      ageMonths += 12;
    }

    // Return whole number if it's exactly on the birth month and day
    if (ageMonths === 0 && days >= 0) {
      return ageYears.toString();
    }

    // Otherwise return decimal (e.g., 28.6)
    const decimalAge = ageYears + ageMonths / 12;
    return decimalAge.toFixed(1);
  };

  // Check if today is birthday
  const isBirthdayToday = (birthdayString) => {
    if (!birthdayString) return false;

    const [day, month] = birthdayString.split("/").map(Number);
    const today = new Date();

    return today.getDate() === day && today.getMonth() + 1 === month;
  };

  const age = calculateAge(boardingData?.birthday);
  const isBirthday = isBirthdayToday(boardingData?.birthday);

  const preferenceItems = [
    {
      icon: isBirthday ? "celebration" : "cake",
      label: strings.birthday,
      value: boardingData?.birthday,
      show: boardingData?.birthday,
    },
    {
      icon: "person",
      label: strings.age,
      value: age,
      show: age,
    },
    {
      icon: "flag",
      label: strings.goals,
      value: boardingData?.preferredGoals?.join(", "),
      show:
        boardingData?.preferredGoals && boardingData.preferredGoals.length > 0,
    },
  ];

  return (
    <View style={styles.container}>
      {preferenceItems.map(
        (item, index) =>
          item.show && (
            <View key={index} style={styles.row}>
              <MaterialIcons
                name={item.icon}
                size={22}
                color={Colors.PRIMARY}
              />
              <Text style={styles.labelText}>{item.label}</Text>
              <Text style={styles.valueText}>{item.value}</Text>
            </View>
          )
      )}
    </View>
  );
}

const strings = {
  birthday: "תאריך לידה",
  age: "גיל",
  goals: "מטרות",
  noData: "אין מידע זמין",
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 15,
    gap: 8,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: 8,
  },
  labelText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#404040",
  },
  valueText: {
    flex: 1,
    fontSize: 17,
    color: "#666",
    textAlign: "right",
  },
});
