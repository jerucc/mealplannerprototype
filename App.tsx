import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Screen = 'home' | 'scan' | 'plan' | 'grocery';
type MealSlot = 'Breakfast' | 'Lunch' | 'Dinner';

const palette = {
  ink: '#20352C',
  muted: '#78837B',
  green: '#45634E',
  greenLight: '#E8EEE6',
  cream: '#F7F6F0',
  white: '#FFFFFF',
  line: '#E7E8E0',
  orange: '#D98257',
  orangeLight: '#F8E9DF',
  yellow: '#F3D992',
};

const weekDays = [
  { short: 'M', label: 'Mon', date: '19' },
  { short: 'T', label: 'Tue', date: '20' },
  { short: 'W', label: 'Wed', date: '21' },
  { short: 'T', label: 'Thu', date: '22' },
  { short: 'F', label: 'Fri', date: '23' },
  { short: 'S', label: 'Sat', date: '24' },
  { short: 'S', label: 'Sun', date: '25' },
];

const starterGroceries = [
  { name: 'Baby spinach', amount: '1 bag' },
  { name: 'Cherry tomatoes', amount: '1 pint' },
  { name: 'Chickpeas', amount: '2 cans' },
  { name: 'Avocados', amount: '2' },
  { name: 'Feta cheese', amount: '1 small block' },
];

function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [returnScreen, setReturnScreen] = useState<Screen>('home');
  const [manualEntry, setManualEntry] = useState(false);
  const [savedMeal, setSavedMeal] = useState('');
  const [activeDay, setActiveDay] = useState(6);
  const [activeSlot, setActiveSlot] = useState<MealSlot>('Dinner');
  const [plannedMeals, setPlannedMeals] = useState<Record<string, string>>({
    '1-Lunch': 'Green goddess bowl',
    '3-Dinner': 'Lemony orzo',
    '5-Lunch': 'Roasted tomato soup',
  });
  const [checkedItems, setCheckedItems] = useState<string[]>(['Chickpeas']);
  const [groceryItems, setGroceryItems] = useState(starterGroceries);
  const [newGrocery, setNewGrocery] = useState('');
  const [foodName, setFoodName] = useState('Grain & greens bowl');
  const [portion, setPortion] = useState('1 medium bowl');
  const [detectedFoods, setDetectedFoods] = useState([
    { name: 'Quinoa', amount: 'about ½ cup' },
    { name: 'Baby spinach', amount: 'a handful' },
    { name: 'Avocado', amount: 'about ½' },
  ]);
  const [isUnsure, setIsUnsure] = useState(false);
  const [showMealPicker, setShowMealPicker] = useState(false);

  const openScan = (manual: boolean) => {
    setReturnScreen(screen);
    setManualEntry(manual);
    setFoodName(manual ? '' : 'Grain & greens bowl');
    setPortion(manual ? '' : '1 medium bowl');
    setDetectedFoods([
      { name: 'Quinoa', amount: 'about ½ cup' },
      { name: 'Baby spinach', amount: 'a handful' },
      { name: 'Avocado', amount: 'about ½' },
    ]);
    setIsUnsure(false);
    setScreen('scan');
  };

  const saveScan = () => {
    const meal = foodName.trim() || 'My meal';
    setSavedMeal(meal);
    setPlannedMeals((previous) => ({
      ...previous,
      [`${activeDay}-${returnScreen === 'plan' ? activeSlot : 'Dinner'}`]: meal,
    }));
    setScreen(returnScreen);
  };

  const toggleGroceryItem = (name: string) => {
    setCheckedItems((items) =>
      items.includes(name) ? items.filter((item) => item !== name) : [...items, name],
    );
  };

  const addGroceryItem = () => {
    const name = newGrocery.trim();
    if (!name) return;
    setGroceryItems((items) => [...items, { name, amount: '1' }]);
    setNewGrocery('');
  };

  const addPlannedMeal = (meal: string) => {
    setPlannedMeals((previous) => ({
      ...previous,
      [`${activeDay}-${activeSlot}`]: meal,
    }));
  };

  const renderHome = () => (
    <>
      <View style={styles.homeHeader}>
        <View>
          <Text style={styles.eyebrow}>SUNDAY, OCTOBER 25</Text>
          <Text style={styles.greeting}>A little goodness,</Text>
          <Text style={styles.greeting}>one meal at a time.</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>J</Text>
        </View>
      </View>

      <View style={styles.streakCard}>
        <View style={styles.streakIcon}>
          <Text style={styles.streakEmoji}>✳</Text>
        </View>
        <View style={styles.streakCopy}>
          <Text style={styles.streakTitle}>You’re finding your rhythm</Text>
          <Text style={styles.streakSubtitle}>3 meals logged this week</Text>
        </View>
        <Text style={styles.cardArrow}>›</Text>
      </View>

      <SectionTitle title="Today’s table" />
      <View style={styles.mealList}>
        <View style={styles.mealRow}>
          <View style={[styles.mealIcon, { backgroundColor: '#F6EBDD' }]}>
            <Text style={styles.mealEmoji}>🥣</Text>
          </View>
          <View style={styles.mealInfo}>
            <Text style={styles.mealTime}>BREAKFAST · 8:15 AM</Text>
            <Text style={styles.mealName}>Oatmeal with berries</Text>
          </View>
          <Text style={styles.mealChevron}>›</Text>
        </View>
        <View style={styles.rowDivider} />
        <View style={styles.mealRow}>
          <View style={[styles.mealIcon, { backgroundColor: '#E8EFE1' }]}>
            <Text style={styles.mealEmoji}>🥑</Text>
          </View>
          <View style={styles.mealInfo}>
            <Text style={styles.mealTime}>LUNCH · 12:40 PM</Text>
            <Text style={styles.mealName}>Avocado toast</Text>
          </View>
          <Text style={styles.mealChevron}>›</Text>
        </View>
        {savedMeal ? (
          <>
            <View style={styles.rowDivider} />
            <View style={styles.mealRow}>
              <View style={[styles.mealIcon, { backgroundColor: '#F7E7DE' }]}>
                <Text style={styles.mealEmoji}>🍲</Text>
              </View>
              <View style={styles.mealInfo}>
                <Text style={styles.mealTime}>DINNER · JUST NOW</Text>
                <Text style={styles.mealName}>{savedMeal}</Text>
              </View>
              <Text style={styles.mealChevron}>›</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.rowDivider} />
            <View style={styles.mealRow}>
              <View style={[styles.mealIcon, styles.emptyMealIcon]}>
                <Text style={styles.emptyMealPlus}>+</Text>
              </View>
              <View style={styles.mealInfo}>
                <Text style={styles.mealTime}>DINNER</Text>
                <Text style={styles.emptyMealText}>Add something when you’re ready</Text>
              </View>
            </View>
          </>
        )}
      </View>

      <SectionTitle title="What would you like to do?" />
      <View style={styles.actionGrid}>
        <Pressable style={styles.primaryAction} onPress={() => openScan(false)}>
          <Text style={styles.actionIcon}>◉</Text>
          <Text style={styles.primaryActionTitle}>Scan a meal</Text>
          <Text style={styles.primaryActionSubtitle}>Photo to food log</Text>
          <Text style={styles.actionArrow}>↗</Text>
        </Pressable>
        <Pressable style={styles.secondaryAction} onPress={() => openScan(true)}>
          <Text style={styles.secondaryActionIcon}>＋</Text>
          <Text style={styles.secondaryActionTitle}>Add manually</Text>
          <Text style={styles.secondaryActionSubtitle}>Write it your way</Text>
        </Pressable>
      </View>

      <Pressable style={styles.weekPreview} onPress={() => setScreen('plan')}>
        <View style={styles.weekPreviewTop}>
          <Text style={styles.weekPreviewLabel}>A LOOK AHEAD</Text>
          <Text style={styles.sectionAction}>Plan your week  →</Text>
        </View>
        <Text style={styles.weekPreviewTitle}>A week with a little more ease</Text>
        <View style={styles.previewMeals}>
          <Text style={styles.previewMeal}>🥗  Green goddess bowl</Text>
          <Text style={styles.previewMeal}>🍋  Lemony orzo</Text>
        </View>
      </Pressable>
    </>
  );

  const renderScan = () => (
    <>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={() => setScreen(returnScreen)}>
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <Text style={styles.topBarTitle}>{manualEntry ? 'Add a meal' : 'Review your meal'}</Text>
        <View style={styles.topBarSpacer} />
      </View>

      <View style={styles.scanPhoto}>
        <View style={styles.photoSun} />
        <View style={styles.foodPlate}>
          <Text style={styles.foodPlateEmoji}>{manualEntry ? '🍽️' : '🥗'}</Text>
        </View>
        <View style={styles.photoTag}>
          <Text style={styles.photoTagText}>{manualEntry ? 'YOUR FOOD LOG' : 'SAMPLE PHOTO'}</Text>
        </View>
        <Text style={styles.photoCaption}>
          {manualEntry ? 'Add the details below' : 'Sample photo for review'}
        </Text>
      </View>

      <View style={styles.reviewIntro}>
        <Text style={styles.eyebrow}>{manualEntry ? 'MEAL DETAILS' : 'SUGGESTED FROM YOUR PHOTO'}</Text>
        <Text style={styles.reviewHeading}>
          {manualEntry ? 'What did you have?' : 'Does this look right?'}
        </Text>
        <Text style={styles.reviewCopy}>
          {manualEntry
            ? 'Add what you ate. You can always make changes later.'
            : 'These are suggestions, not a perfect guess. Make them yours before saving.'}
        </Text>
      </View>

      <View style={styles.editCard}>
        <Text style={styles.inputLabel}>MEAL NAME</Text>
        <TextInput
          value={foodName}
          onChangeText={setFoodName}
          placeholder="e.g. Veggie wrap"
          placeholderTextColor="#A6ADA6"
          style={styles.mealInput}
        />
        {!manualEntry ? (
          <>
            <View style={styles.inputDivider} />
            <Text style={styles.inputLabel}>WE SPOTTED</Text>
            <View style={styles.ingredientList}>
              {detectedFoods.map((food, index) => (
                <View key={`food-${index}`} style={styles.ingredientRow}>
                  <Text style={styles.ingredientCheck}>✓</Text>
                  <TextInput
                    value={food.name}
                    onChangeText={(name) =>
                      setDetectedFoods((foods) =>
                        foods.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, name } : item,
                        ),
                      )
                    }
                    style={styles.ingredientInput}
                  />
                  <TextInput
                    value={food.amount}
                    onChangeText={(amount) =>
                      setDetectedFoods((foods) =>
                        foods.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, amount } : item,
                        ),
                      )
                    }
                    style={styles.ingredientAmountInput}
                  />
                </View>
              ))}
            </View>
          </>
        ) : null}
        <View style={styles.inputDivider} />
        <Text style={styles.inputLabel}>PORTION</Text>
        <TextInput
          value={portion}
          onChangeText={setPortion}
          placeholder="e.g. 1 serving"
          placeholderTextColor="#A6ADA6"
          style={styles.mealInput}
        />
      </View>

      {!manualEntry ? (
        <Pressable
          style={[styles.unsureRow, isUnsure && styles.unsureSelected]}
          onPress={() => setIsUnsure((value) => !value)}
        >
          <View style={[styles.radio, isUnsure && styles.radioSelected]}>
            {isUnsure ? <View style={styles.radioDot} /> : null}
          </View>
          <View style={styles.unsureCopy}>
            <Text style={styles.unsureTitle}>I’m not sure about these</Text>
            <Text style={styles.unsureSubtitle}>That’s okay — you can save without guessing.</Text>
          </View>
        </Pressable>
      ) : null}

      <View style={styles.estimateNote}>
        <Text style={styles.noteSparkle}>✳</Text>
        <Text style={styles.estimateText}>
          {isUnsure
            ? 'No estimates will be added. Your meal is saved just as you entered it.'
            : 'Any nutrition details are estimates. Check ingredients and portions yourself.'}
        </Text>
      </View>
      <Pressable style={styles.saveButton} onPress={saveScan}>
        <Text style={styles.saveButtonText}>Save to my food log</Text>
        <Text style={styles.saveButtonArrow}>→</Text>
      </Pressable>
      <Pressable style={styles.cancelButton} onPress={() => setScreen(returnScreen)}>
        <Text style={styles.cancelButtonText}>Not now</Text>
      </Pressable>
    </>
  );

  const renderPlan = () => (
    <>
      <View style={styles.pageHeading}>
        <Text style={styles.eyebrow}>A LITTLE PREP, A LOT LESS THINKING</Text>
        <Text style={styles.pageTitle}>Your week,{"\n"}your way.</Text>
        <Text style={styles.pageSubtitle}>Add meals that sound good. Change them anytime.</Text>
      </View>

      <View style={styles.weekStrip}>
        {weekDays.map((day, index) => (
          <Pressable
            key={`${day.label}-${index}`}
            style={[styles.dayButton, activeDay === index && styles.dayButtonActive]}
            onPress={() => setActiveDay(index)}
          >
            <Text style={[styles.dayLabel, activeDay === index && styles.dayLabelActive]}>
              {day.label}
            </Text>
            <Text style={[styles.dayDate, activeDay === index && styles.dayDateActive]}>
              {day.date}
            </Text>
            <View style={[styles.dayDot, plannedMeals[`${index}-Lunch`] || plannedMeals[`${index}-Dinner`] ? styles.dayDotFilled : null]} />
          </Pressable>
        ))}
      </View>

      <View style={styles.selectedDayRow}>
        <Text style={styles.selectedDayTitle}>{weekDays[activeDay].label}, October {weekDays[activeDay].date}</Text>
        <Text style={styles.planCount}>
          {Object.keys(plannedMeals).filter((key) => key.startsWith(`${activeDay}-`)).length} planned
        </Text>
      </View>

      <View style={styles.planSlotList}>
        {(['Breakfast', 'Lunch', 'Dinner'] as MealSlot[]).map((slot, index) => {
          const meal = plannedMeals[`${activeDay}-${slot}`];
          const emoji = ['🥣', '🥗', '🍲'][index];
          return (
            <View key={slot} style={styles.planSlot}>
              <View style={[styles.slotIcon, { backgroundColor: ['#F6EBDD', '#E8EFE1', '#F7E7DE'][index] }]}>
                <Text style={styles.mealEmoji}>{emoji}</Text>
              </View>
              <View style={styles.slotInfo}>
                <Text style={styles.slotLabel}>{slot.toUpperCase()}</Text>
                <Text style={[styles.slotMealName, !meal && styles.slotEmpty]}>
                  {meal || 'Nothing planned yet'}
                </Text>
              </View>
              <Pressable
                style={styles.slotAdd}
                onPress={() => {
                  setActiveSlot(slot);
                  setScreen('plan');
                  setShowMealPicker(true);
                }}
              >
                <Text style={styles.slotAddText}>{meal ? '···' : '+'}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      <View style={styles.planTip}>
        <Text style={styles.tipIcon}>✳</Text>
        <View style={styles.tipCopy}>
          <Text style={styles.tipTitle}>Keep it flexible</Text>
          <Text style={styles.tipText}>Your plan is a gentle guide, not another thing to get perfect.</Text>
        </View>
      </View>

      {showMealPicker ? (
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeadingRow}>
              <View>
                <Text style={styles.eyebrow}>ADD TO {activeSlot.toUpperCase()}</Text>
                <Text style={styles.pickerTitle}>Pick something lovely</Text>
              </View>
              <Pressable onPress={() => setShowMealPicker(false)} style={styles.pickerClose}>
                <Text style={styles.pickerCloseText}>×</Text>
              </Pressable>
            </View>
            {['Green goddess bowl', 'Lemony orzo', 'Roasted tomato soup', 'Something from my log'].map((meal, index) => (
              <Pressable
                key={meal}
                style={styles.pickerOption}
                onPress={() => {
                  if (meal === 'Something from my log' && savedMeal) addPlannedMeal(savedMeal);
                  else addPlannedMeal(meal === 'Something from my log' ? 'Avocado toast' : meal);
                  setShowMealPicker(false);
                }}
              >
                <Text style={styles.pickerEmoji}>{['🥗', '🍋', '🍅', '📓'][index]}</Text>
                <Text style={styles.pickerOptionText}>{meal}</Text>
                <Text style={styles.mealChevron}>›</Text>
              </Pressable>
            ))}
            <Pressable
              style={styles.pickerScan}
              onPress={() => {
                setShowMealPicker(false);
                openScan(true);
              }}
            >
              <Text style={styles.pickerScanText}>＋  Add a meal manually</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </>
  );

  const renderGrocery = () => {
    const checkedCount = groceryItems.filter((item) => checkedItems.includes(item.name)).length;
    return (
      <>
        <View style={styles.pageHeading}>
          <Text style={styles.eyebrow}>THE SMALL THINGS THAT MAKE IT EASY</Text>
          <Text style={styles.pageTitle}>Your grocery{"\n"}list.</Text>
          <Text style={styles.pageSubtitle}>A few good things for the meals you’ve planned.</Text>
        </View>

        <View style={styles.listProgressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>This week’s list</Text>
              <Text style={styles.progressSubtitle}>Made from your meal plan</Text>
            </View>
            <View style={styles.progressCount}>
              <Text style={styles.progressCountText}>{checkedCount}/{groceryItems.length}</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${groceryItems.length ? (checkedCount / groceryItems.length) * 100 : 0}%` },
              ]}
            />
          </View>
          <Text style={styles.progressHint}>
            {checkedCount === groceryItems.length ? 'All done — nice work!' : 'Check things off as you go'}
          </Text>
        </View>

        <SectionTitle
          title="For your meals"
          action="Remove checked"
          onAction={() => {
            setGroceryItems((items) =>
              items.filter((item) => !checkedItems.includes(item.name)),
            );
            setCheckedItems([]);
          }}
        />
        <View style={styles.groceryCard}>
          {groceryItems.map((item, index) => {
            const checked = checkedItems.includes(item.name);
            return (
              <View key={`${item.name}-${index}`}>
                {index > 0 ? <View style={styles.rowDivider} /> : null}
                <View style={styles.groceryRow}>
                  <Pressable
                    style={[styles.checkbox, checked && styles.checkboxChecked]}
                    onPress={() => toggleGroceryItem(item.name)}
                  >
                    {checked ? <Text style={styles.checkboxMark}>✓</Text> : null}
                  </Pressable>
                  <Text style={[styles.groceryName, checked && styles.groceryChecked]}>
                    {item.name}
                  </Text>
                  <Text style={styles.groceryAmount}>{item.amount}</Text>
                </View>
              </View>
            );
          })}
          <View style={styles.rowDivider} />
          <View style={styles.addGroceryRow}>
            <TextInput
              value={newGrocery}
              onChangeText={setNewGrocery}
              onSubmitEditing={addGroceryItem}
              placeholder="Add something else…"
              placeholderTextColor="#9BA49B"
              style={styles.groceryInput}
              returnKeyType="done"
            />
            <Pressable style={styles.addGroceryButton} onPress={addGroceryItem}>
              <Text style={styles.addGroceryButtonText}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.groceryFooter}>
          <Text style={styles.footerEmoji}>🌱</Text>
          <Text style={styles.groceryFooterText}>Your list stays yours. Add, change, or skip anything.</Text>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.appFrame}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {screen === 'home' ? renderHome() : null}
          {screen === 'scan' ? renderScan() : null}
          {screen === 'plan' ? renderPlan() : null}
          {screen === 'grocery' ? renderGrocery() : null}
        </ScrollView>
        {screen !== 'scan' ? (
          <View style={styles.tabBar}>
            <Pressable style={styles.tabItem} onPress={() => setScreen('home')}>
              <Text style={[styles.tabIcon, screen === 'home' && styles.tabIconActive]}>⌂</Text>
              <Text style={[styles.tabLabel, screen === 'home' && styles.tabLabelActive]}>Home</Text>
            </Pressable>
            <Pressable style={styles.tabItem} onPress={() => setScreen('plan')}>
              <Text style={[styles.tabIcon, screen === 'plan' && styles.tabIconActive]}>▦</Text>
              <Text style={[styles.tabLabel, screen === 'plan' && styles.tabLabelActive]}>My week</Text>
            </Pressable>
            <Pressable style={styles.tabItem} onPress={() => setScreen('grocery')}>
              <Text style={[styles.tabIcon, screen === 'grocery' && styles.tabIconActive]}>☷</Text>
              <Text style={[styles.tabLabel, screen === 'grocery' && styles.tabLabelActive]}>Groceries</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.cream },
  appFrame: { flex: 1, width: '100%', maxWidth: 520, alignSelf: 'center' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 32 },
  homeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 },
  eyebrow: { color: palette.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1.35, marginBottom: 9 },
  greeting: { color: palette.ink, fontSize: 27, lineHeight: 33, fontWeight: '600', letterSpacing: -0.6 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#DCE5D7', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: palette.green, fontSize: 17, fontWeight: '700' },
  streakCard: { backgroundColor: palette.green, borderRadius: 15, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  streakIcon: { width: 37, height: 37, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.17)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  streakEmoji: { fontSize: 21, color: '#F6D98A' },
  streakCopy: { flex: 1 },
  streakTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', marginBottom: 4 },
  streakSubtitle: { color: '#DCE7D8', fontSize: 11 },
  cardArrow: { color: '#DCE7D8', fontSize: 22, marginLeft: 8 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13, marginTop: 2 },
  sectionTitle: { color: palette.ink, fontSize: 17, fontWeight: '600', letterSpacing: -0.2 },
  sectionAction: { color: palette.green, fontSize: 11, fontWeight: '600' },
  mealList: { backgroundColor: palette.white, borderRadius: 15, paddingHorizontal: 14, paddingVertical: 2, marginBottom: 28, borderWidth: 1, borderColor: '#F0F0EA' },
  mealRow: { flexDirection: 'row', alignItems: 'center', minHeight: 68 },
  mealIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  mealEmoji: { fontSize: 20 },
  mealInfo: { flex: 1 },
  mealTime: { color: '#919990', fontSize: 9, letterSpacing: 1, fontWeight: '700', marginBottom: 5 },
  mealName: { color: palette.ink, fontSize: 13, fontWeight: '500' },
  mealChevron: { color: '#A9B0A8', fontSize: 22, marginLeft: 8 },
  rowDivider: { height: 1, backgroundColor: '#F0F1EC', marginLeft: 54 },
  emptyMealIcon: { backgroundColor: '#F5F5EF', borderWidth: 1, borderColor: '#E6E8E0', borderStyle: 'dashed' },
  emptyMealPlus: { color: '#AAB3A9', fontSize: 21 },
  emptyMealText: { color: '#9AA39A', fontSize: 12 },
  actionGrid: { flexDirection: 'row', gap: 11, marginBottom: 25 },
  primaryAction: { flex: 1, minHeight: 128, borderRadius: 15, backgroundColor: palette.green, padding: 15, position: 'relative' },
  actionIcon: { color: '#F5D88D', fontSize: 20, marginBottom: 11 },
  primaryActionTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', marginBottom: 4 },
  primaryActionSubtitle: { color: '#D4E0D2', fontSize: 10 },
  actionArrow: { color: '#D4E0D2', fontSize: 17, position: 'absolute', right: 13, top: 13 },
  secondaryAction: { flex: 1, minHeight: 128, borderRadius: 15, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: palette.line, padding: 15 },
  secondaryActionIcon: { color: palette.orange, fontSize: 22, marginBottom: 10 },
  secondaryActionTitle: { color: palette.ink, fontSize: 13, fontWeight: '600', marginBottom: 4 },
  secondaryActionSubtitle: { color: palette.muted, fontSize: 10 },
  weekPreview: { borderRadius: 15, borderWidth: 1, borderColor: palette.line, backgroundColor: '#F0F1E9', padding: 16, marginBottom: 10 },
  weekPreviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13 },
  weekPreviewLabel: { color: palette.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1.1 },
  weekPreviewTitle: { color: palette.ink, fontSize: 15, fontWeight: '600', marginBottom: 13 },
  previewMeals: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  previewMeal: { color: palette.green, backgroundColor: '#FFFFFF', borderRadius: 9, paddingVertical: 7, paddingHorizontal: 9, fontSize: 10 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: palette.line },
  backArrow: { color: palette.ink, fontSize: 27, lineHeight: 30, marginTop: -3 },
  topBarTitle: { color: palette.ink, fontSize: 14, fontWeight: '600' },
  topBarSpacer: { width: 34 },
  scanPhoto: { height: 182, overflow: 'hidden', borderRadius: 17, backgroundColor: '#E6E7D9', alignItems: 'center', justifyContent: 'center', marginBottom: 21 },
  photoSun: { width: 175, height: 175, borderRadius: 88, position: 'absolute', top: -77, right: -45, backgroundColor: '#EFD9A6', opacity: 0.7 },
  foodPlate: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#FCFAF2', alignItems: 'center', justifyContent: 'center', borderWidth: 8, borderColor: '#D8DED0', shadowColor: '#26362A', shadowOpacity: 0.11, shadowRadius: 8, elevation: 2 },
  foodPlateEmoji: { fontSize: 52 },
  photoTag: { position: 'absolute', top: 13, left: 13, backgroundColor: 'rgba(255,255,255,0.83)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  photoTagText: { color: palette.green, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  photoCaption: { position: 'absolute', bottom: 13, color: '#59675B', fontSize: 10 },
  reviewIntro: { marginBottom: 15 },
  reviewHeading: { color: palette.ink, fontSize: 23, fontWeight: '600', letterSpacing: -0.4, marginBottom: 6 },
  reviewCopy: { color: palette.muted, fontSize: 12, lineHeight: 18 },
  editCard: { backgroundColor: palette.white, borderRadius: 15, padding: 15, borderWidth: 1, borderColor: '#ECEDE6', marginBottom: 12 },
  inputLabel: { color: '#929A91', fontSize: 9, fontWeight: '700', letterSpacing: 1.05, marginBottom: 7 },
  mealInput: { color: palette.ink, fontSize: 13, paddingVertical: 3 },
  inputDivider: { height: 1, backgroundColor: '#EEF0E9', marginVertical: 12 },
  ingredientList: { gap: 11 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center' },
  ingredientCheck: { color: palette.green, fontSize: 13, fontWeight: '700', marginRight: 9 },
  ingredientInput: { color: palette.ink, fontSize: 12, flex: 1, paddingVertical: 2 },
  ingredientAmountInput: { color: palette.muted, fontSize: 11, paddingVertical: 2, textAlign: 'right', minWidth: 88 },
  unsureRow: { backgroundColor: '#FFFFFF', borderRadius: 13, borderWidth: 1, borderColor: palette.line, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  unsureSelected: { borderColor: palette.green, backgroundColor: '#F5F8F3' },
  radio: { width: 19, height: 19, borderRadius: 10, borderWidth: 1.5, borderColor: '#BEC7BB', marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: palette.green },
  radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: palette.green },
  unsureCopy: { flex: 1 },
  unsureTitle: { color: palette.ink, fontSize: 11, fontWeight: '600', marginBottom: 3 },
  unsureSubtitle: { color: palette.muted, fontSize: 10 },
  estimateNote: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 3, marginTop: 2, marginBottom: 17 },
  noteSparkle: { color: palette.orange, fontSize: 13, marginRight: 8 },
  estimateText: { color: palette.muted, fontSize: 10, lineHeight: 15, flex: 1 },
  saveButton: { height: 49, backgroundColor: palette.green, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 8 },
  saveButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  saveButtonArrow: { color: '#FFFFFF', fontSize: 17, marginLeft: 8, marginTop: -2 },
  cancelButton: { alignItems: 'center', justifyContent: 'center', paddingVertical: 11 },
  cancelButtonText: { color: palette.muted, fontSize: 11, fontWeight: '500' },
  pageHeading: { marginTop: 7, marginBottom: 23 },
  pageTitle: { color: palette.ink, fontSize: 32, lineHeight: 36, fontWeight: '600', letterSpacing: -1, marginBottom: 9 },
  pageSubtitle: { color: palette.muted, fontSize: 12, lineHeight: 18 },
  weekStrip: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: 15, paddingVertical: 11, paddingHorizontal: 8, borderWidth: 1, borderColor: '#ECEDE6', marginBottom: 21 },
  dayButton: { width: 38, height: 63, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  dayButtonActive: { backgroundColor: palette.green },
  dayLabel: { color: '#929A91', fontSize: 9, fontWeight: '600', marginBottom: 6 },
  dayLabelActive: { color: '#D9E3D7' },
  dayDate: { color: palette.ink, fontSize: 13, fontWeight: '600' },
  dayDateActive: { color: '#FFFFFF' },
  dayDot: { width: 4, height: 4, borderRadius: 2, marginTop: 5 },
  dayDotFilled: { backgroundColor: palette.orange },
  selectedDayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  selectedDayTitle: { color: palette.ink, fontSize: 14, fontWeight: '600' },
  planCount: { color: palette.muted, fontSize: 10 },
  planSlotList: { backgroundColor: '#FFFFFF', borderRadius: 15, borderWidth: 1, borderColor: '#ECEDE6', paddingHorizontal: 13, marginBottom: 18 },
  planSlot: { minHeight: 76, flexDirection: 'row', alignItems: 'center' },
  slotIcon: { width: 41, height: 41, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  slotInfo: { flex: 1 },
  slotLabel: { color: '#929A91', fontSize: 9, fontWeight: '700', letterSpacing: 0.9, marginBottom: 5 },
  slotMealName: { color: palette.ink, fontSize: 12, fontWeight: '500' },
  slotEmpty: { color: '#A0A89F', fontWeight: '400' },
  slotAdd: { width: 31, height: 31, borderRadius: 16, backgroundColor: '#F3F5EF', alignItems: 'center', justifyContent: 'center' },
  slotAddText: { color: palette.green, fontSize: 20, lineHeight: 24 },
  planTip: { backgroundColor: '#F0F1E9', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'flex-start' },
  tipIcon: { color: palette.orange, fontSize: 17, marginRight: 10, marginTop: 1 },
  tipCopy: { flex: 1 },
  tipTitle: { color: palette.ink, fontSize: 11, fontWeight: '600', marginBottom: 4 },
  tipText: { color: palette.muted, fontSize: 10, lineHeight: 15 },
  pickerOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(32,53,44,0.25)', justifyContent: 'flex-end', paddingHorizontal: 9, paddingBottom: 12 },
  pickerCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 17, borderWidth: 1, borderColor: '#E8EAE2' },
  pickerHeadingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  pickerTitle: { color: palette.ink, fontSize: 18, fontWeight: '600' },
  pickerClose: { width: 29, height: 29, borderRadius: 15, backgroundColor: '#F1F2EC', alignItems: 'center', justifyContent: 'center' },
  pickerCloseText: { color: palette.muted, fontSize: 22, lineHeight: 25, marginTop: -2 },
  pickerOption: { minHeight: 49, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F1EC' },
  pickerEmoji: { fontSize: 17, width: 32 },
  pickerOptionText: { color: palette.ink, fontSize: 12, flex: 1 },
  pickerScan: { paddingTop: 13, alignItems: 'center' },
  pickerScanText: { color: palette.green, fontSize: 12, fontWeight: '600' },
  listProgressCard: { backgroundColor: palette.green, borderRadius: 15, padding: 16, marginBottom: 27 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  progressTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  progressSubtitle: { color: '#D5E0D2', fontSize: 10 },
  progressCount: { backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  progressCountText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  progressTrack: { height: 5, backgroundColor: 'rgba(255,255,255,0.21)', borderRadius: 3, overflow: 'hidden', marginBottom: 9 },
  progressFill: { height: 5, backgroundColor: '#F3D992', borderRadius: 3 },
  progressHint: { color: '#D5E0D2', fontSize: 9 },
  groceryCard: { backgroundColor: '#FFFFFF', borderRadius: 15, borderWidth: 1, borderColor: '#ECEDE6', paddingHorizontal: 14, paddingTop: 2, marginBottom: 17 },
  groceryRow: { minHeight: 53, flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.4, borderColor: '#C5CDC2', marginRight: 11, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: palette.green, borderColor: palette.green },
  checkboxMark: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', lineHeight: 15 },
  groceryName: { color: palette.ink, fontSize: 12, flex: 1 },
  groceryChecked: { color: '#9AA39A', textDecorationLine: 'line-through' },
  groceryAmount: { color: palette.muted, fontSize: 10 },
  addGroceryRow: { flexDirection: 'row', alignItems: 'center', minHeight: 51 },
  groceryInput: { flex: 1, color: palette.ink, fontSize: 12, paddingVertical: 9 },
  addGroceryButton: { width: 29, height: 29, borderRadius: 15, backgroundColor: '#E8EEE6', alignItems: 'center', justifyContent: 'center' },
  addGroceryButtonText: { color: palette.green, fontSize: 20, lineHeight: 24 },
  groceryFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, gap: 7 },
  footerEmoji: { fontSize: 13 },
  groceryFooterText: { color: palette.muted, fontSize: 10 },
  tabBar: { height: 69, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E9EAE4', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 8, paddingBottom: 5 },
  tabItem: { width: 80, alignItems: 'center', justifyContent: 'center' },
  tabIcon: { color: '#9AA39A', fontSize: 20, lineHeight: 24, marginBottom: 2 },
  tabIconActive: { color: palette.green },
  tabLabel: { color: '#9AA39A', fontSize: 9 },
  tabLabelActive: { color: palette.green, fontWeight: '700' },
});
