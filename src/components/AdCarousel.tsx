import React, { useState, useRef } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
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
  dragX,
  isTop,
}: {
  index: number;
  dragX: SharedValue<number>;
  isTop: boolean;
}) {
  const cardStyle = useAnimatedStyle(() => {
    const scale = 1 - index * 0.06;
    const translateY = index * 12;
    const rotateZ = isTop
      ? (dragX.value / W) * 28
      : index % 2 === 0
      ? -2
      : 2;
    const translateX = isTop ? dragX.value : 0;

    return {
      transform: [
        { scale },
        { translateY },
        { translateX },
        { rotateZ: `${rotateZ}deg` },
      ],
    };
  });

  return (
    <Animated.View style={[styles.card, cardStyle]}>
      {/* Glossy top gradient overlay */}
      <LinearGradient
        colors={['rgba(255,255,255,0.15)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.cardGloss}
      />
      <View style={styles.cardAccent} />
      <Text style={styles.cardText}>Реклама</Text>
    </Animated.View>
  );
}

function wrapperStyle(zIndex: number) {
  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    zIndex,
  };
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
        dragX.value = withTiming(0, { duration: 220 });
      }
    });

  return (
    <View style={styles.container}>
      {cards.map((card, index) => {
        const z = cards.length - index;
        return index === 0 ? (
          <GestureDetector key={card.id} gesture={pan}>
            <View style={wrapperStyle(z)} pointerEvents="box-none">
              <AdCard index={index} dragX={dragX} isTop={true} />
            </View>
          </GestureDetector>
        ) : (
          <View key={card.id} style={wrapperStyle(z)} pointerEvents="none">
            <AdCard index={index} dragX={dragX} isTop={false} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  card: {
    width: 240,
    height: 275,
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
    fontSize: 30,
    fontWeight: '500',
    letterSpacing: 1,
  },
});
