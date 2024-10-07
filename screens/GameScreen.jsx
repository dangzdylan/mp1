import React, { useState } from "react";

import {Image, Text, View, TouchableOpacity} from "react-native";

import { styles } from "../constants/Styles";
import { nameToPic } from "../constants/Constants";
import { useEffect } from "react";
import { shuffle } from "../utils/ArrayUtils";
import { Button } from "react-native-web";

const names = Object.keys(nameToPic);

export default function GameScreen() {
  const [numCorrect, setNumCorrect] = useState(0);
  const [numTotal, setNumTotal] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [correctAnswerImage, setCorrectAnswerImage] = useState(0);
  const [answerOptions, setAnswerOptions] = useState(0);

  // State for the timer is handled for you.
  const [timeLeft, setTimeLeft] = useState(5000);

  // Called by the timer every 10 seconds
  const countDown = () => {
    if (timeLeft > 0) {
      // Time still left, so decrement time state variable
      setTimeLeft(timeLeft - 10);
    } else {
      // Time has expired
      setNumTotal(numTotal + 1)
    }
  };

  // This is used in the useEffect(...) hook bound on a specific STATE variable.
  // It updates state to present a new member & name options.
  const getNextRound = () => {
    // Fetches the next member name to guess.
    let correct = names[Math.floor(Math.random() * names.length)];
    let correctName = nameToPic[correct][0];
    let correctImage = nameToPic[correct][1];

    // Generate 3 more wrong answers.
    let nameOptions = [correctName];
    while (nameOptions.length < 4) {
      let wrong = names[Math.floor(Math.random() * names.length)];
      let wrongName = nameToPic[wrong][0];
      if (!nameOptions.includes(wrongName)) {
        nameOptions.push(wrongName);
      }
    }
    nameOptions = shuffle(nameOptions);

    setCorrectAnswer(correctName);
    setCorrectAnswerImage(correctImage);
    setAnswerOptions(nameOptions);

    setTimeLeft(5000);
  };

  // Called when user taps a name option.
  const selectedNameChoice = (index) => {
    if (answerOptions[index] == correctAnswer) {
      setNumCorrect(numCorrect + 1)
    }
    setNumTotal(numTotal + 1);
  };

  // Call the countDown() method every 10 milliseconds.
  useEffect(() => {
    const timer = setInterval(() => countDown(), 10);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  useEffect(
    () => {
      getNextRound();
    },
    [numTotal]
  );

  // Set up four name button components
  const nameButtons = [];
  for (let i = 0; i < 4; i++) {
    const j = i;
    nameButtons.push(
      // A button is just a Text component wrapped in a TouchableOpacity component.
      <TouchableOpacity
        key={j}
        style={styles.button}
        onPress={() => selectedNameChoice(j)}
      >
        <Text style={styles.buttonText}>
          {answerOptions[j]}
        </Text>
      </TouchableOpacity>
    );
  }

  const timeRemainingStr = (timeLeft / 1000).toFixed(2);

  // Style & return the view.
  return (
    <View>
      <Text style={styles.scoreText}>
        Current Score: {numCorrect}/{numTotal}
      </Text>
      <Text style={styles.timerText}>
        Time Remaining: {timeRemainingStr}
      </Text>

      <Image source= {correctAnswerImage} style={styles.image}/>
      {nameButtons[0]}
      {nameButtons[1]}
      {nameButtons[2]}
      {nameButtons[3]}

    </View>
  );
}
