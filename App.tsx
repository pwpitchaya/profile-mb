import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  LayoutChangeEvent,
  Linking,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type ThemeName = "light" | "dark";

type Palette = {
  background: string;
  surface: string;
  surfaceStrong: string;
  text: string;
  muted: string;
  border: string;
  softBorder: string;
  darkCard: string;
  darkText: string;
  purple: string;
  purpleSoft: string;
  cyan: string;
  lime: string;
  pink: string;
  shadow: string;
};

const THEMES: Record<ThemeName, Palette> = {
  light: {
    background: "#E9EBF2",
    surface: "#F7F8FC",
    surfaceStrong: "#FFFFFF",
    text: "#12131A",
    muted: "#747784",
    border: "rgba(24, 26, 36, 0.10)",
    softBorder: "rgba(255, 255, 255, 0.75)",
    darkCard: "#11121D",
    darkText: "#FFFFFF",
    purple: "#6657EE",
    purpleSoft: "#C8C4FF",
    cyan: "#63DCE6",
    lime: "#BCEB72",
    pink: "#F19BC2",
    shadow: "rgba(38, 35, 70, 0.15)",
  },
  dark: {
    background: "#080910",
    surface: "#11131C",
    surfaceStrong: "#171924",
    text: "#F7F7FA",
    muted: "#9A9DAA",
    border: "rgba(255, 255, 255, 0.10)",
    softBorder: "rgba(255, 255, 255, 0.05)",
    darkCard: "#06070D",
    darkText: "#FFFFFF",
    purple: "#7C6FFF",
    purpleSoft: "#403B78",
    cyan: "#4FCBD8",
    lime: "#A8DA64",
    pink: "#E58CB7",
    shadow: "rgba(0, 0, 0, 0.38)",
  },
};

const SKILLS = [
  "React Native",
  "Expo SDK 57",
  "TypeScript",
  "JavaScript",
  "Python",
  "UI / UX",
  "Artificial Intelligence",
  "Git & GitHub",
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function App() {
  return (
    <SafeAreaProvider>
      <Portfolio />
    </SafeAreaProvider>
  );
}

function Portfolio() {
  const systemTheme = useColorScheme();
  const [themeName, setThemeName] = useState<ThemeName>(
    systemTheme === "dark" ? "dark" : "light"
  );
  const palette = THEMES[themeName];
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isWide = width >= 760;
  const pageWidth = Math.min(width, 1120);
  const horizontalPadding = width < 390 ? 16 : width < 760 ? 20 : 36;
  const contentWidth = pageWidth - horizontalPadding * 2;
  const scrollRef = useRef<ScrollView>(null);
  const [aboutY, setAboutY] = useState(0);
  const scrollY = useSharedValue(0);
  const floatOne = useSharedValue(0);
  const floatTwo = useSharedValue(0);
  const toggleRotation = useSharedValue(themeName === "dark" ? 1 : 0);

  useEffect(() => {
    floatOne.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
        withTiming(9, { duration: 2400, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    floatTwo.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(10, { duration: 2100, easing: Easing.inOut(Easing.quad) }),
          withTiming(-10, { duration: 2100, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      )
    );
  }, [floatOne, floatTwo]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const portraitStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [0, 650], [0, 58], "clamp") },
      { scale: interpolate(scrollY.value, [0, 520], [1, 0.94], "clamp") },
    ],
  }));

  const floatingStyleOne = useAnimatedStyle(() => ({
    transform: [{ translateY: floatOne.value }, { rotate: "-8deg" }],
  }));

  const floatingStyleTwo = useAnimatedStyle(() => ({
    transform: [{ translateY: floatTwo.value }, { rotate: "8deg" }],
  }));

  const toggleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${toggleRotation.value * 180}deg` }],
  }));

  const switchTheme = () => {
    const nextTheme = themeName === "light" ? "dark" : "light";
    setThemeName(nextTheme);
    toggleRotation.value = withSpring(nextTheme === "dark" ? 1 : 0, {
      damping: 14,
      stiffness: 150,
    });
    if (process.env.EXPO_OS === "ios") {
      void Haptics.selectionAsync();
    }
  };

  const scrollToAbout = () => {
    scrollRef.current?.scrollTo({ y: Math.max(aboutY - 28, 0), animated: true });
  };

  const saveAboutPosition = (event: LayoutChangeEvent) => {
    setAboutY(event.nativeEvent.layout.y);
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <StatusBar style={themeName === "dark" ? "light" : "dark"} />

      <Animated.ScrollView
        ref={scrollRef as React.RefObject<ScrollView>}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{
          alignItems: "center",
          paddingTop: Math.max(insets.top, 12),
          paddingBottom: Math.max(insets.bottom, 28),
        }}
      >
        <Animated.View
          key={`page-${themeName}`}
          entering={FadeIn.duration(280)}
          style={{
            width: pageWidth,
            paddingHorizontal: horizontalPadding,
            gap: 18,
          }}
        >
          <View
            style={{
              minHeight: 56,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="กลับไปด้านบน"
              onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  borderCurve: "continuous",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: palette.purple,
                  transform: [{ rotate: "-8deg" }],
                }}
              >
                <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "900" }}>
                  PK
                </Text>
              </View>
              <View>
                <Text selectable style={{ color: palette.text, fontSize: 12, fontWeight: "800", letterSpacing: 0.8 }}>
                  PAWAPITCHAYA
                </Text>
                <Text style={{ color: palette.muted, fontSize: 9, letterSpacing: 1.2 }}>
                  DIGITAL PORTFOLIO
                </Text>
              </View>
            </Pressable>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              {isWide ? (
                <Pressable
                  onPress={scrollToAbout}
                  style={{ paddingHorizontal: 16, paddingVertical: 10 }}
                >
                  <Text style={{ color: palette.muted, fontSize: 12, fontWeight: "700" }}>
                    About me
                  </Text>
                </Pressable>
              ) : null}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={themeName === "light" ? "เปิดโหมดมืด" : "เปิดโหมดสว่าง"}
                onPress={switchTheme}
                style={({ pressed }) => ({
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: palette.surfaceStrong,
                  borderWidth: 1,
                  borderColor: palette.border,
                  boxShadow: `0 8px 24px ${palette.shadow}`,
                  opacity: pressed ? 0.72 : 1,
                })}
              >
                <Animated.Text
                  style={[
                    { color: palette.text, fontSize: 20, fontWeight: "600" },
                    toggleStyle,
                  ]}
                >
                  {themeName === "light" ? "☼" : "☾"}
                </Animated.Text>
              </Pressable>
            </View>
          </View>

          <LinearGradient
            colors={
              themeName === "light"
                ? ["#FBFBFE", "#EEF0FF", "#E3E5F0"]
                : ["#1A1C29", "#121420", "#0E1018"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              minHeight: isWide ? 560 : 690,
              borderRadius: 36,
              borderCurve: "continuous",
              overflow: "hidden",
              borderWidth: 1,
              borderColor: palette.softBorder,
              boxShadow: `0 24px 60px ${palette.shadow}`,
              padding: isWide ? 48 : 24,
            }}
          >
            <View
              style={{
                position: "absolute",
                width: isWide ? 440 : 340,
                height: isWide ? 440 : 340,
                borderRadius: 220,
                right: isWide ? -40 : -110,
                bottom: isWide ? -70 : -40,
                backgroundColor:
                  themeName === "light" ? "rgba(112, 98, 244, 0.20)" : "rgba(115, 101, 255, 0.16)",
              }}
            />
            <View
              style={{
                position: "absolute",
                width: 190,
                height: 190,
                borderRadius: 95,
                right: isWide ? 280 : 190,
                bottom: isWide ? 30 : 160,
                backgroundColor: "rgba(91, 218, 226, 0.13)",
              }}
            />

            <Animated.View
              entering={FadeInUp.duration(560)}
              style={{
                width: isWide ? "48%" : "100%",
                zIndex: 5,
                gap: 16,
              }}
            >
              <View
                style={{
                  alignSelf: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: themeName === "light" ? "rgba(255,255,255,0.68)" : "rgba(255,255,255,0.06)",
                  borderWidth: 1,
                  borderColor: palette.border,
                }}
              >
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: palette.lime }} />
                <Text style={{ color: palette.text, fontSize: 10, fontWeight: "800", letterSpacing: 1.1 }}>
                  AVAILABLE FOR NEW IDEAS
                </Text>
              </View>

              <Text
                selectable
                style={{
                  color: palette.text,
                  fontSize: isWide ? 54 : width < 390 ? 39 : 43,
                  lineHeight: isWide ? 58 : width < 390 ? 42 : 47,
                  letterSpacing: -1.8,
                  fontWeight: "700",
                }}
              >
                Building useful{"\n"}digital experiences.
              </Text>

              <Text
                selectable
                style={{
                  color: palette.muted,
                  maxWidth: 440,
                  fontSize: 14,
                  lineHeight: 22,
                }}
              >
                นักศึกษาสายเทคโนโลยีที่หลงใหลในการสร้างแอปพลิเคชัน
                ประสบการณ์ผู้ใช้ และผลิตภัณฑ์ดิจิทัลที่ทั้งสวยและใช้งานได้จริง
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 4 }}>
                <PressScale onPress={scrollToAbout} backgroundColor={palette.purple}>
                  <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "800" }}>
                    Explore my work
                  </Text>
                  <Text style={{ color: "#FFFFFF", fontSize: 18 }}>↘</Text>
                </PressScale>
                <Pressable
                  onPress={() => openUrl("mailto:curvepawapitchaya@gmail.com")}
                  style={({ pressed }) => ({
                    width: 46,
                    height: 46,
                    borderRadius: 23,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: palette.border,
                    backgroundColor: themeName === "light" ? "rgba(255,255,255,0.58)" : "rgba(255,255,255,0.05)",
                    opacity: pressed ? 0.65 : 1,
                  })}
                >
                  <Text style={{ color: palette.text, fontSize: 18 }}>@</Text>
                </Pressable>
              </View>
            </Animated.View>

            <View
              pointerEvents="none"
              style={{
                position: isWide ? "absolute" : "relative",
                width: isWide ? "54%" : "100%",
                height: isWide ? "100%" : 330,
                right: isWide ? 0 : undefined,
                bottom: isWide ? 0 : -30,
                marginTop: isWide ? 0 : 10,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  width: isWide ? 310 : 250,
                  height: isWide ? 310 : 250,
                  borderRadius: 155,
                  backgroundColor: themeName === "light" ? "rgba(255,255,255,0.60)" : "rgba(255,255,255,0.05)",
                  right: isWide ? 76 : 8,
                  bottom: isWide ? 54 : 0,
                  borderWidth: 1,
                  borderColor: palette.softBorder,
                }}
              />
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    width: isWide ? 390 : 310,
                    height: isWide ? 510 : 390,
                    right: isWide ? 20 : -12,
                    bottom: isWide ? -38 : -56,
                  },
                  portraitStyle,
                ]}
              >
                <Image
                  source={require("./assets/pitcha02.png")}
                  resizeMode="contain"
                  style={{ width: "100%", height: "100%" }}
                />
              </Animated.View>

              <Animated.View
                style={[
                  {
                    position: "absolute",
                    left: isWide ? 56 : -2,
                    bottom: isWide ? 156 : 80,
                    width: 104,
                    padding: 14,
                    gap: 9,
                    borderRadius: 24,
                    borderCurve: "continuous",
                    backgroundColor: palette.darkCard,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.12)",
                    boxShadow: "0 18px 30px rgba(0,0,0,0.24)",
                  },
                  floatingStyleOne,
                ]}
              >
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: palette.pink }} />
                  <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: palette.cyan }} />
                </View>
                <Text style={{ color: "#FFFFFF", fontSize: 10, lineHeight: 15, fontWeight: "700" }}>
                  Think.{"\n"}Design.{"\n"}Build.
                </Text>
              </Animated.View>

              <Animated.View
                style={[
                  {
                    position: "absolute",
                    right: isWide ? 28 : -4,
                    top: isWide ? 92 : 22,
                    width: 116,
                    height: 88,
                    padding: 13,
                    borderRadius: 24,
                    borderCurve: "continuous",
                    backgroundColor: themeName === "light" ? "rgba(250,250,255,0.82)" : "rgba(38,40,54,0.88)",
                    borderWidth: 1,
                    borderColor: palette.softBorder,
                    boxShadow: `0 18px 30px ${palette.shadow}`,
                  },
                  floatingStyleTwo,
                ]}
              >
                <Text style={{ color: palette.muted, fontSize: 8, fontWeight: "700" }}>CURRENT FOCUS</Text>
                <Text style={{ color: palette.text, fontSize: 18, fontWeight: "800", marginTop: 7 }}>Mobile UI</Text>
                <View style={{ height: 4, borderRadius: 2, backgroundColor: palette.border, marginTop: 8 }}>
                  <View style={{ width: "74%", height: 4, borderRadius: 2, backgroundColor: palette.purple }} />
                </View>
              </Animated.View>
            </View>
          </LinearGradient>

          <Animated.View
            entering={FadeInDown.delay(150).duration(520)}
            style={{
              flexDirection: "row",
              gap: 10,
            }}
          >
            <StatCard value="4th" label="Year student" palette={palette} />
            <StatCard value="08+" label="Core skills" palette={palette} />
            <StatCard value="∞" label="Curiosity" palette={palette} />
          </Animated.View>

          <View onLayout={saveAboutPosition} style={{ gap: 18, paddingTop: 20 }}>
            <SectionHeading
              eyebrow="A LITTLE ABOUT ME"
              title="Curious mind.\nPurposeful maker."
              palette={palette}
            />

            <View style={{ flexDirection: isWide ? "row" : "column", gap: 14 }}>
              <Animated.View
                entering={FadeInUp.duration(520)}
                style={{
                  flex: isWide ? 1.15 : undefined,
                  minHeight: 330,
                  padding: 26,
                  borderRadius: 30,
                  borderCurve: "continuous",
                  overflow: "hidden",
                  backgroundColor: palette.darkCard,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.10)",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: palette.purple,
                    }}
                  >
                    <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "900" }}>P</Text>
                  </View>
                  <Text style={{ color: "rgba(255,255,255,0.50)", fontSize: 11, letterSpacing: 1.3 }}>
                    PROFILE / 01
                  </Text>
                </View>

                <Text selectable style={{ color: "#FFFFFF", fontSize: 29, lineHeight: 35, fontWeight: "700", marginTop: 32 }}>
                  ภวพิชญา คำวงษา
                </Text>
                <Text selectable style={{ color: palette.purpleSoft, fontSize: 14, lineHeight: 21, marginTop: 8 }}>
                  Pawapitchaya Kamwongsa
                </Text>
                <Text selectable style={{ color: "rgba(255,255,255,0.62)", fontSize: 14, lineHeight: 23, marginTop: 24, maxWidth: 480 }}>
                  นักศึกษาวิทยาการคอมพิวเตอร์และสารสนเทศ ผู้สนใจการพัฒนาแอปพลิเคชัน AI และการออกแบบประสบการณ์ที่เข้าใจผู้ใช้
                </Text>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 26 }}>
                  {["Student ID 663450042-8", "Khon Kaen University"].map((item) => (
                    <View
                      key={item}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 9,
                        borderRadius: 18,
                        backgroundColor: "rgba(255,255,255,0.07)",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.09)",
                      }}
                    >
                      <Text selectable style={{ color: "rgba(255,255,255,0.80)", fontSize: 10, fontWeight: "700" }}>
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
                <View style={{ position: "absolute", width: 150, height: 150, borderRadius: 75, right: -45, bottom: -45, backgroundColor: "rgba(109,91,246,0.20)" }} />
                <View style={{ position: "absolute", width: 32, height: 32, borderRadius: 16, right: 24, bottom: 30, backgroundColor: palette.cyan }} />
              </Animated.View>

              <View style={{ flex: 0.85, gap: 14 }}>
                <InfoPanel
                  index="02"
                  label="EDUCATION"
                  title="Computer Science &\nInformation Systems"
                  description="วิทยาลัยการคอมพิวเตอร์ มหาวิทยาลัยขอนแก่น"
                  accent={palette.cyan}
                  palette={palette}
                />
                <InfoPanel
                  index="03"
                  label="APPROACH"
                  title="Learn. Make. Refine."
                  description="เปลี่ยนไอเดียให้เป็นประสบการณ์ที่เรียบง่าย ชัดเจน และมีชีวิต"
                  accent={palette.pink}
                  palette={palette}
                />
              </View>
            </View>
          </View>

          <View style={{ gap: 16, paddingTop: 26 }}>
            <SectionHeading
              eyebrow="TOOLBOX"
              title="Skills I bring\nto the screen."
              palette={palette}
            />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {SKILLS.map((skill, index) => (
                <Animated.View
                  key={skill}
                  entering={FadeInUp.delay(index * 45).duration(420)}
                  style={{
                    flexGrow: 1,
                    minWidth: isWide ? 190 : contentWidth > 370 ? "45%" : "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    padding: 16,
                    borderRadius: 20,
                    borderCurve: "continuous",
                    backgroundColor: palette.surface,
                    borderWidth: 1,
                    borderColor: palette.border,
                  }}
                >
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 11,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: index % 3 === 0 ? palette.purple : index % 3 === 1 ? palette.cyan : palette.lime,
                    }}
                  >
                    <Text style={{ color: index % 3 === 2 ? "#17191E" : "#FFFFFF", fontSize: 12, fontWeight: "900" }}>
                      {String(index + 1).padStart(2, "0")}
                    </Text>
                  </View>
                  <Text selectable style={{ color: palette.text, fontSize: 13, fontWeight: "700" }}>
                    {skill}
                  </Text>
                </Animated.View>
              ))}
            </View>
          </View>

          <View style={{ gap: 16, paddingTop: 28 }}>
            <SectionHeading
              eyebrow="SELECTED CONCEPTS"
              title="Made to feel\nas good as it looks."
              palette={palette}
            />
            <View style={{ flexDirection: isWide ? "row" : "column", gap: 14 }}>
              <ProjectCard
                number="01"
                category="MOBILE EXPERIENCE"
                title="UniFlow"
                description="แอปจัดการชีวิตนักศึกษาที่รวมตารางเรียน งาน และกิจกรรมไว้ในที่เดียว"
                palette={palette}
                variant="phone"
              />
              <ProjectCard
                number="02"
                category="AI PRODUCT"
                title="Insight AI"
                description="แนวคิดแดชบอร์ดที่ช่วยเปลี่ยนข้อมูลซับซ้อนให้เป็น insight ที่เข้าใจง่าย"
                palette={palette}
                variant="chart"
              />
            </View>
          </View>

          <LinearGradient
            colors={themeName === "light" ? ["#6B5CF0", "#5143D9"] : ["#6F62F1", "#3D347F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              minHeight: 310,
              borderRadius: 34,
              borderCurve: "continuous",
              padding: isWide ? 40 : 26,
              marginTop: 28,
              overflow: "hidden",
              justifyContent: "space-between",
            }}
          >
            <View style={{ position: "absolute", width: 260, height: 260, borderRadius: 130, right: -80, top: -80, backgroundColor: "rgba(255,255,255,0.10)" }} />
            <View style={{ position: "absolute", width: 120, height: 120, borderRadius: 60, right: 90, bottom: -50, backgroundColor: "rgba(93,220,230,0.28)" }} />
            <View>
              <Text style={{ color: "rgba(255,255,255,0.68)", fontSize: 10, fontWeight: "800", letterSpacing: 1.6 }}>
                LET'S CREATE SOMETHING USEFUL
              </Text>
              <Text selectable style={{ color: "#FFFFFF", fontSize: isWide ? 46 : 36, lineHeight: isWide ? 50 : 40, fontWeight: "700", letterSpacing: -1.2, marginTop: 18, maxWidth: 620 }}>
                Have an idea?{"\n"}Let’s make it real.
              </Text>
            </View>
            <View style={{ flexDirection: isWide ? "row" : "column", alignItems: isWide ? "center" : "flex-start", gap: 14, marginTop: 34 }}>
              <PressScale onPress={() => openUrl("mailto:curvepawapitchaya@gmail.com")} backgroundColor="#FFFFFF">
                <Text style={{ color: "#171822", fontSize: 13, fontWeight: "800" }}>Start a conversation</Text>
                <Text style={{ color: "#171822", fontSize: 18 }}>↗</Text>
              </PressScale>
              <Text selectable style={{ color: "rgba(255,255,255,0.74)", fontSize: 12 }}>
                curvepawapitchaya@gmail.com
              </Text>
            </View>
          </LinearGradient>

          <View style={{ flexDirection: isWide ? "row" : "column", justifyContent: "space-between", gap: 18, paddingHorizontal: 4, paddingTop: 18 }}>
            <View>
              <Text style={{ color: palette.text, fontSize: 13, fontWeight: "800" }}>Pawapitchaya Kamwongsa</Text>
              <Text style={{ color: palette.muted, fontSize: 10, marginTop: 4 }}>Built with Expo SDK 57 · React Native · TypeScript</Text>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              <FooterLink label="Instagram" onPress={() => openUrl("https://www.instagram.com/210947cp")} palette={palette} />
              <FooterLink label="Facebook" onPress={() => openUrl("https://www.facebook.com/search/top?q=pawapitchaya%20kamwongsa")} palette={palette} />
              <FooterLink label="Call" onPress={() => openUrl("tel:0982016388")} palette={palette} />
            </View>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

function PressScale({
  children,
  onPress,
  backgroundColor,
}: {
  children: React.ReactNode;
  onPress: () => void;
  backgroundColor: string;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 16, stiffness: 240 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 220 });
      }}
      style={[
        {
          height: 46,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          paddingHorizontal: 18,
          borderRadius: 23,
          backgroundColor,
          boxShadow: "0 12px 24px rgba(41, 35, 98, 0.18)",
        },
        animatedStyle,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}

function StatCard({ value, label, palette }: { value: string; label: string; palette: Palette }) {
  return (
    <View
      style={{
        flex: 1,
        minHeight: 92,
        justifyContent: "center",
        paddingHorizontal: 14,
        borderRadius: 22,
        borderCurve: "continuous",
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.border,
      }}
    >
      <Text selectable style={{ color: palette.text, fontSize: 22, fontWeight: "800", fontVariant: ["tabular-nums"] }}>
        {value}
      </Text>
      <Text style={{ color: palette.muted, fontSize: 9, lineHeight: 13, marginTop: 4 }}>
        {label}
      </Text>
    </View>
  );
}

function SectionHeading({ eyebrow, title, palette }: { eyebrow: string; title: string; palette: Palette }) {
  return (
    <Animated.View entering={FadeInUp.duration(480)} style={{ gap: 11 }}>
      <Text style={{ color: palette.purple, fontSize: 10, fontWeight: "900", letterSpacing: 1.7 }}>
        {eyebrow}
      </Text>
      <Text selectable style={{ color: palette.text, fontSize: 34, lineHeight: 38, fontWeight: "700", letterSpacing: -1.1 }}>
        {title}
      </Text>
    </Animated.View>
  );
}

function InfoPanel({
  index,
  label,
  title,
  description,
  accent,
  palette,
}: {
  index: string;
  label: string;
  title: string;
  description: string;
  accent: string;
  palette: Palette;
}) {
  return (
    <Animated.View
      entering={FadeInUp.duration(520)}
      style={{
        flex: 1,
        minHeight: 158,
        padding: 21,
        borderRadius: 28,
        borderCurve: "continuous",
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.border,
        overflow: "hidden",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ color: accent, fontSize: 10, fontWeight: "900", letterSpacing: 1.1 }}>{label}</Text>
        <Text style={{ color: palette.muted, fontSize: 10 }}>{index}</Text>
      </View>
      <Text selectable style={{ color: palette.text, fontSize: 19, lineHeight: 24, fontWeight: "700", marginTop: 19 }}>
        {title}
      </Text>
      <Text selectable style={{ color: palette.muted, fontSize: 11, lineHeight: 17, marginTop: 8, maxWidth: 420 }}>
        {description}
      </Text>
      <View style={{ position: "absolute", right: -18, bottom: -20, width: 76, height: 76, borderRadius: 25, transform: [{ rotate: "18deg" }], backgroundColor: accent, opacity: 0.16 }} />
    </Animated.View>
  );
}

function ProjectCard({
  number,
  category,
  title,
  description,
  palette,
  variant,
}: {
  number: string;
  category: string;
  title: string;
  description: string;
  palette: Palette;
  variant: "phone" | "chart";
}) {
  const progress = useSharedValue(0.2);

  useEffect(() => {
    progress.value = withDelay(500, withSpring(1, { damping: 18, stiffness: 80 }));
  }, [progress]);

  return (
    <Animated.View
      entering={FadeInUp.duration(540)}
      style={{
        flex: 1,
        minHeight: 480,
        padding: 22,
        borderRadius: 30,
        borderCurve: "continuous",
        backgroundColor: variant === "phone" ? palette.surface : palette.darkCard,
        borderWidth: 1,
        borderColor: variant === "phone" ? palette.border : "rgba(255,255,255,0.09)",
        overflow: "hidden",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: variant === "phone" ? palette.purple : palette.cyan, fontSize: 10, fontWeight: "900", letterSpacing: 1.3 }}>
          {category}
        </Text>
        <Text style={{ color: variant === "phone" ? palette.muted : "rgba(255,255,255,0.45)", fontSize: 10 }}>{number}</Text>
      </View>
      <Text selectable style={{ color: variant === "phone" ? palette.text : "#FFFFFF", fontSize: 28, fontWeight: "800", marginTop: 18 }}>
        {title}
      </Text>
      <Text selectable style={{ color: variant === "phone" ? palette.muted : "rgba(255,255,255,0.58)", fontSize: 12, lineHeight: 19, marginTop: 8, maxWidth: 440 }}>
        {description}
      </Text>

      {variant === "phone" ? (
        <PhoneMockup palette={palette} />
      ) : (
        <ChartMockup palette={palette} progress={progress} />
      )}
    </Animated.View>
  );
}

function PhoneMockup({ palette }: { palette: Palette }) {
  const hover = useSharedValue(0);
  useEffect(() => {
    hover.value = withRepeat(
      withSequence(
        withTiming(-7, { duration: 1900, easing: Easing.inOut(Easing.quad) }),
        withTiming(4, { duration: 1900, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, [hover]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: hover.value }, { rotate: "-4deg" }] }));

  return (
    <View style={{ flex: 1, minHeight: 280, alignItems: "center", justifyContent: "flex-end", marginTop: 14 }}>
      <View style={{ position: "absolute", width: 240, height: 240, borderRadius: 120, backgroundColor: palette.purpleSoft, opacity: 0.38, bottom: -60 }} />
      <Animated.View
        style={[
          {
            width: 170,
            height: 286,
            borderRadius: 32,
            borderCurve: "continuous",
            backgroundColor: palette.darkCard,
            borderWidth: 5,
            borderColor: "#252735",
            padding: 14,
            boxShadow: `0 24px 36px ${palette.shadow}`,
          },
          style,
        ]}
      >
        <View style={{ width: 46, height: 6, borderRadius: 3, backgroundColor: "#303240", alignSelf: "center" }} />
        <Text style={{ color: "rgba(255,255,255,0.48)", fontSize: 8, marginTop: 20 }}>GOOD MORNING</Text>
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800", marginTop: 4 }}>My day</Text>
        <LinearGradient colors={[palette.purple, "#8C82FF"]} style={{ padding: 13, borderRadius: 16, marginTop: 15 }}>
          <Text style={{ color: "rgba(255,255,255,0.70)", fontSize: 8 }}>NEXT CLASS</Text>
          <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "800", marginTop: 5 }}>Mobile Application</Text>
          <Text style={{ color: "rgba(255,255,255,0.72)", fontSize: 8, marginTop: 4 }}>10:30 · Room CS-401</Text>
        </LinearGradient>
        {["UI prototype", "AI workshop", "Project review"].map((item, index) => (
          <View key={item} style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: index === 0 ? palette.cyan : index === 1 ? palette.pink : palette.lime }} />
            <Text style={{ color: "rgba(255,255,255,0.70)", fontSize: 8 }}>{item}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

function ChartMockup({ palette, progress }: { palette: Palette; progress: SharedValue<number> }) {
  const bars = [0.45, 0.68, 0.54, 0.86, 0.72, 1];
  return (
    <View style={{ flex: 1, minHeight: 280, justifyContent: "flex-end", marginTop: 16 }}>
      <LinearGradient
        colors={["rgba(124,111,255,0.34)", "rgba(38,40,55,0.78)"]}
        style={{
          minHeight: 250,
          borderRadius: 24,
          borderCurve: "continuous",
          padding: 18,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.11)",
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ color: "rgba(255,255,255,0.48)", fontSize: 8 }}>ENGAGEMENT</Text>
            <Text selectable style={{ color: "#FFFFFF", fontSize: 25, fontWeight: "800", marginTop: 5, fontVariant: ["tabular-nums"] }}>84.6%</Text>
          </View>
          <View style={{ paddingHorizontal: 10, paddingVertical: 7, borderRadius: 14, backgroundColor: "rgba(188,235,114,0.16)" }}>
            <Text style={{ color: palette.lime, fontSize: 9, fontWeight: "800" }}>+18.4%</Text>
          </View>
        </View>
        <View style={{ height: 145, flexDirection: "row", alignItems: "flex-end", gap: 8, paddingTop: 25 }}>
          {bars.map((height, index) => (
            <AnimatedBar key={`${height}-${index}`} height={height} progress={progress} color={index === bars.length - 1 ? palette.cyan : "rgba(255,255,255,0.19)"} />
          ))}
        </View>
      </LinearGradient>
      <Animated.View
        entering={FadeInDown.delay(700)}
        style={{
          position: "absolute",
          right: -3,
          bottom: 34,
          width: 116,
          padding: 13,
          borderRadius: 20,
          backgroundColor: "#F5F5FA",
          boxShadow: "0 18px 30px rgba(0,0,0,0.28)",
        }}
      >
        <Text style={{ color: "#777985", fontSize: 8 }}>AI CONFIDENCE</Text>
        <Text style={{ color: "#151620", fontSize: 22, fontWeight: "900", marginTop: 4 }}>92%</Text>
        <View style={{ height: 4, borderRadius: 2, backgroundColor: "#DADBE3", marginTop: 8 }}>
          <View style={{ width: "92%", height: 4, borderRadius: 2, backgroundColor: palette.purple }} />
        </View>
      </Animated.View>
    </View>
  );
}

function AnimatedBar({
  height,
  progress,
  color,
}: {
  height: number;
  progress: SharedValue<number>;
  color: string;
}) {
  const style = useAnimatedStyle(() => ({
    transform: [{ scaleY: progress.value }],
  }));
  return (
    <Animated.View
      style={[
        {
          flex: 1,
          height: `${height * 100}%`,
          borderRadius: 7,
          backgroundColor: color,
          transformOrigin: "bottom",
        },
        style,
      ]}
    />
  );
}

function FooterLink({ label, onPress, palette }: { label: string; onPress: () => void; palette: Palette }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 17,
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.border,
        opacity: pressed ? 0.62 : 1,
      })}
    >
      <Text style={{ color: palette.text, fontSize: 10, fontWeight: "700" }}>{label} ↗</Text>
    </Pressable>
  );
}

async function openUrl(url: string) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert("ไม่สามารถเปิดลิงก์นี้ได้");
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert("เกิดข้อผิดพลาด", "กรุณาลองใหม่อีกครั้ง");
  }
}
