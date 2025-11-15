import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  BackHandler,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "../../constants/Colors";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../../configs/FirebaseConfig";
import BodyPartItem from "./StudentExercisesComponents/BodyPartItem";
import Footer from "./StudentExercisesComponents/Footer";
import StudentPreferences from "./StudentExercisesComponents/StudentPreferences";

export default function StudentExercises() {
  const router = useRouter();
  const item = useLocalSearchParams();
  const [bodyPartsList, setBodyPartsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState({});
  const [initialExercises, setInitialExercises] = useState({});
  const [backPressed, setBackPressed] = useState(false);

  useEffect(() => {
    GetBodyParts();
    LoadUserExercises();
  }, []);

  const GetBodyParts = async () => {
    setLoading(true);
    setBodyPartsList([]);
    try {
      const q = query(collection(db, "BodyParts"));
      const querySnapshot = await getDocs(q);
      const bodyParts = [];
      querySnapshot.forEach((doc) => {
        bodyParts.push({ id: doc.id, ...doc.data() });
      });
      setBodyPartsList(bodyParts);
    } catch (error) {
      console.error("Error fetching body parts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load existing exercises for the user
  const LoadUserExercises = async () => {
    try {
      const userRef = doc(db, "Users", item.id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.assignedExercises) {
          setSelectedExercises(userData.assignedExercises);
          setInitialExercises(userData.assignedExercises);
        }
      }
    } catch (error) {
      console.error("Error loading user exercises:", error);
    }
  };

  // Check if exercises have been modified
  const hasUnsavedChanges = () => {
    return (
      JSON.stringify(selectedExercises) !== JSON.stringify(initialExercises)
    );
  };

  // Handle hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (hasUnsavedChanges()) {
          BackButton();
          return true; // Prevent default back behavior
        }
        return false; // Allow default back behavior
      }
    );

    return () => backHandler.remove();
  }, [selectedExercises, initialExercises]);

  const BackButton = () => {
    if (!hasUnsavedChanges()) {
      router.back();
      return;
    }

    setBackPressed(true);
    Alert.alert(strings.back, strings.backConfirm, [
      {
        text: strings.cancel,
        style: "cancel",
        onPress: () => setBackPressed(false),
      },
      {
        text: strings.ok,
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={BackButton} style={styles.btnBack}>
          <AntDesign name="caret-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{strings.subTitle}</Text>
      </View>
      <Text style={styles.subTitle}>
        {strings.for}
        <Text style={styles.subTitleName}>{item.name}</Text>
      </Text>
      <StudentPreferences userId={item.id} />
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.PRIMARY}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={bodyPartsList}
          renderItem={({ item: bodyPart }) => (
            <BodyPartItem
              item={bodyPart}
              selectedExercises={selectedExercises}
              setSelectedExercises={setSelectedExercises}
            />
          )}
          keyExtractor={(bodyPart) => bodyPart.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          ListFooterComponent={() => (
            <Footer
              selectedExercises={selectedExercises}
              setSelectedExercises={setSelectedExercises}
              router={router}
              item={item}
            />
          )}
        />
      )}
    </View>
  );
}

const strings = {
  subTitle: "בחירת תרגילים",
  for: "עבור: ",
  cancel: "ביטול",
  ok: "אישור",
  backConfirm: "האם ברצונך לחזור ללא שמירת שינויים?",
  back: "חזרה",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
  },
  subTitle: {
    fontSize: 20,
    textAlign: "right",
    fontWeight: "600",
  },
  subTitleName: {
    color: Colors.PRIMARY,
  },
  btnBack: {
    left: -5,
    position: "absolute",
    backgroundColor: Colors.PRIMARY,
    width: hp(4.8),
    height: hp(4.8),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 99,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});
