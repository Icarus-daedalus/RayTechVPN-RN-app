import React, { useState, useRef } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

const { width: W } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;

const INITIAL_CARDS = [
  { id: 1, text: 'Реклама' },
  { id: 2, text: 'Реклама' },
  { id: 3, text: 'Реклама' },
  { id: 4, text: 'Реклама' },
];

function AdCard({
  index,
  totalCards,
  dragX,
  isTop,
}: {
  index: number;
  totalCards: number;
  dragX: SharedValue<number>;
  isTop: boolean;
}) {
  const cardStyle = useAnimatedStyle(() => {
    const scale = 1 - index * 0.05;
    const translateY = index * 15;
    const rotateZ = isTop
      ? (dragX.value / W) * 30
      : index % 2 === 0
      ? -2
      : 2;
    const translateX = isTop ? dragX.value : 0;
    const opacity = 1 - index * 0.2;

    return {
      transform: [
        { scale },
        { translateY },
        { translateX },
        { rotateZ: `${rotateZ}deg` },
      ],
      opacity,
      zIndex: totalCards - index,
    };
  });

  return (
    <Animated.View style={[styles.card, cardStyle]}>
      {/* Glossy top gradient overlay */}
      <View style={styles.cardGloss} />
      <View style={styles.cardAccent} />
      <Text style={styles.cardText}>Реклама</Text>
    </Animated.View>
  );
}

export function AdCarousel() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const dragX = useSharedValue(0);
  const cardsRef = useRef(cards);
  cardsRef.current = cards;

  function rotateCards() {
    setCards((prev) => {
      const next = [...prev];
      const removed = next.shift();
      if (removed) next.push({ ...removed, id: Date.now() });
      return next;
    });
  }

  function animateOut(direction: 'left' | 'right') {
    const target = direction === 'right' ? W * 1.5 : -W * 1.5;
    dragX.value = withTiming(target, { duration: 200 }, (finished) => {
      if (finished) {
        dragX.value = 0;
        runOnJS(rotateCards)();
      }
    });
  }

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      dragX.value = e.translationX;
    })
    .onEnd((e) => {
      'worklet';
      if (Math.abs(e.translationX) > SWIPE_THRESHOLD) {
        const dir = e.translationX > 0 ? 'right' : 'left';
        runOnJS(animateOut)(dir);
      } else {
        dragX.value = withSpring(0, { stiffness: 300, damping: 20 });
      }
    });

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        index === 0 ? (
          <GestureDetector key={card.id} gesture={pan}>
            <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
              <AdCard
                index={index}
                totalCards={cards.length}
                dragX={dragX}
                isTop={true}
              />
            </View>
          </GestureDetector>
        ) : (
          <View
            key={card.id}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          >
            <AdCard
              index={index}
              totalCards={cards.length}
              dragX={dragX}
              isTop={false}
            />
          </View>
        )
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  card: {
    position: 'absolute',
    width: 180,
    height: 220,
    backgroundColor: '#111111',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  cardGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  cardAccent: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  cardText: {
    color: 'white',
    fontSize: 28,
    fontWeight: '500',
    letterSpacing: 1,
  },
});
