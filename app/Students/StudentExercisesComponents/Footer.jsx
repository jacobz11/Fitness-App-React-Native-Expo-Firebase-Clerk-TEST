import { deleteField, doc, updateDoc } from "firebase/firestore";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { db } from "../../../configs/FirebaseConfig";
import { Colors } from "../../../constants/Colors";
import { useState } from "react";

export default function Footer({
  selectedExercises,
  setSelectedExercises,
  router,
  item,
}) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const userRef = doc(db, "Users", item.id);
      // Check if selectedExercises is empty
      if (Object.keys(selectedExercises).length === 0) {
        // Delete assignedExercises from the database
        await updateDoc(userRef, {
          assignedExercises: deleteField(),
          lastUpdated: new Date().toISOString(),
        });
      } else {
        // Save the grouped exercises
        await updateDoc(userRef, {
          assignedExercises: selectedExercises,
          lastUpdated: new Date().toISOString(),
        });
      }

      Alert.alert(strings.success, strings.saveSuccess, [
        {
          text: strings.ok,
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error saving exercises:", error);
      Alert.alert(strings.error, strings.saveError);
    } finally {
      setSaving(false);
    }
  };

  const OnDeletePress = () => {
    Alert.alert(strings.deleteAll, strings.message, [
      {
        text: strings.ok,
        onPress: () => {
          DeleteStudentExercises();
          router.back();
        },
      },
      {
        text: strings.cancelDel,
        onPress: () => {
          return;
        },
      },
    ]);
  };

  const DeleteStudentExercises = async () => {
    try {
      const userRef = doc(db, "Users", item.id);
      setSelectedExercises({});
      // Delete assignedExercises from the database
      await updateDoc(userRef, {
        assignedExercises: deleteField(),
        lastUpdated: new Date().toISOString(),
      });
      router.back();
    } catch (error) {
      Alert.alert(strings.error, strings.delError, [
        {
          text: strings.ok,
          onPress: () => router.back(),
        },
      ]);
      console.error("Error:", error);
    }
  };
  return (
    <View style={styles.buttons}>
      <TouchableOpacity
        style={[styles.btns, styles.saveBtn]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={[styles.txtBtn, styles.txtSaveBtn]}>{strings.save}</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btns, styles.cancelBtn]}
        onPress={OnDeletePress}
        disabled={saving}
      >
        <Text style={[styles.txtBtn, styles.txtCancelBtn]}>
          {strings.cancel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const strings = {
  save: "שמור שינויים",
  cancel: "מחק הכל",
  success: "נשמר",
  saveSuccess: "תכנית האימונים נשמרה",
  error: "שגיאה",
  saveError: "לא הצלחנו לשמור את תכנית האימון",
  ok: "אישור",
  deleteAll: "למחוק את כל האימונים?",
  message: "פעולה זו איננה ניתנת לביטול",
  delError: "לא הצלחנו למחוק",
  cancelDel: "ביטול",
};

const styles = StyleSheet.create({
  buttons: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  btns: {
    paddingBlock: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#f3f3f3",
    borderRadius: 10,
  },
  saveBtn: {
    backgroundColor: Colors.PRIMARY,
  },
  txtBtn: {
    fontSize: 15,
    fontWeight: "600",
  },
  txtSaveBtn: {
    color: "#fff",
  },
  txtCancelBtn: {
    color: "#000",
  },
  cancelBtn: {
    backgroundColor: "#fff",
  },
});
