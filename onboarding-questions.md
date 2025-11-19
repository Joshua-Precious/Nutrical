# SnapCal Onboarding Questions & Flow

## 🎯 Onboarding Overview

**Duration:** 2-3 minutes  
**Total Screens:** 13  
**Goal:** Collect essential data to calculate personalized calorie targets

---

## **SCREEN 1: Welcome**

### Content
**Headline:** Welcome to SnapCal! 👋  
**Subtext:** Let's personalize your nutrition journey. This takes about 2 minutes.  
**Visual:** App logo or hero illustration

### Actions
- **Primary Button:** "Let's Get Started"
- **Secondary Link:** "I already have an account"

### Progress: None yet

---

## **SCREEN 2: Basic Info**

### Question
"What should we call you?"

### Input
- **Type:** Text field
- **Placeholder:** "Enter your first name"
- **Max length:** 50 characters

### Helper Text
"We'll use this to personalize your experience"

### Validation
- Required field
- Minimum 2 characters

### Actions
- **Primary Button:** "Continue"

### Progress: 1 of 12

---

## **SCREEN 3: Personal Details**

### Question
"Tell us about yourself"

### Inputs

#### Age
- **Type:** Number input or date picker
- **Range:** 13-120 years
- **Placeholder:** "Age"

#### Gender
- **Type:** Single select buttons
- **Options:**
  - Male
  - Female
  - Non-binary
  - Prefer not to say

#### Height
- **Type:** Number input with unit toggle
- **Units:** 
  - Imperial: Feet + Inches
  - Metric: Centimeters
- **Range:** 
  - 4'0" - 8'0" (122cm - 244cm)

#### Current Weight
- **Type:** Number input with unit toggle
- **Units:**
  - Imperial: Pounds (lbs)
  - Metric: Kilograms (kg)
- **Range:** 
  - 66-660 lbs (30-300 kg)

### Helper Text
"This helps us calculate your personalized calorie goals"

### Validation
- All fields required
- Age: Must be 13+
- Height/Weight: Must be within realistic ranges

### Actions
- **Primary Button:** "Continue"
- **Secondary Link:** "Why do we need this?"

### Progress: 2 of 12

---

## **SCREEN 4: Activity Level** 🏃

### Question
"How active are you on a typical day?"

### Options
**Type:** Single select cards with icons and descriptions

#### 🛋️ Sedentary
- **Label:** "Sedentary"
- **Description:** "Little to no exercise, desk job"
- **Examples:** "Office work, mostly sitting"

#### 🚶 Lightly Active
- **Label:** "Lightly Active"
- **Description:** "Light exercise 1-3 days/week"
- **Examples:** "Walking, light housework"

#### 🏃 Moderately Active
- **Label:** "Moderately Active"
- **Description:** "Moderate exercise 3-5 days/week"
- **Examples:** "Regular gym, jogging, sports"

#### 💪 Very Active
- **Label:** "Very Active"
- **Description:** "Hard exercise 6-7 days/week"
- **Examples:** "Daily intense workouts, athlete"

#### 🏋️ Extra Active
- **Label:** "Extra Active"
- **Description:** "Very hard exercise daily + physical job"
- **Examples:** "Professional athlete, construction worker who trains"

### Helper Text
"Your activity level affects how many calories you need daily"

### Validation
- Must select one option

### Actions
- **Primary Button:** "Continue"

### Progress: 3 of 12

---

## **SCREEN 5: Primary Goal** 🎯

### Question
"What's your main goal with SnapCal?"

### Options
**Type:** Large card selection with icons

#### 🔻 Lose Weight
- **Description:** "Reduce body weight at a healthy, sustainable pace"

#### ⚖️ Maintain Weight
- **Description:** "Keep your current weight stable"

#### 🔺 Gain Weight
- **Description:** "Build muscle or increase body mass"

#### 💪 Build Muscle
- **Description:** "Gain lean muscle mass while staying lean"

#### 🥗 Eat Healthier
- **Description:** "Improve nutrition and food quality"

### Helper Text
"Your goal determines your daily calorie target"

### Validation
- Must select one option

### Actions
- **Primary Button:** "Continue"

### Progress: 4 of 12

### Skip Logic
**IF** "Lose Weight" OR "Gain Weight" selected → Go to Screen 5a
**ELSE** → Go to Screen 6

---

## **SCREEN 5a: Weight Goal Details** (Conditional)

### Displayed When
User selected "Lose Weight" or "Gain Weight"

### Question
"How much weight do you want to [lose/gain]?"

### Input Section 1: Rate
**Type:** Single select cards

#### Slow & Sustainable
- **Label:** "0.5 lbs per week"
- **Description:** "Gentle approach, easiest to maintain"
- **Recommended for:** Beginners, sustainable habits

#### Recommended
- **Label:** "1 lb per week"
- **Description:** "Balanced approach"
- **Badge:** "Most Popular"
- **Recommended for:** Most people

#### Aggressive
- **Label:** "1.5-2 lbs per week"
- **Description:** "Challenging but achievable"
- **Warning:** "Requires strict adherence"
- **Recommended for:** Those with significant weight to lose

### Input Section 2: Target Weight (Optional)
- **Type:** Number input
- **Label:** "Target Weight"
- **Placeholder:** "Enter goal weight"
- **Units:** lbs or kg (based on previous selection)
- **Helper:** "Optional - helps us estimate timeline"

### Helper Text
"Safe weight loss/gain is typically 0.5-2 lbs per week"

### Actions
- **Primary Button:** "Continue"
- **Secondary Link:** "Skip for now"

### Progress: 5 of 12

---

## **SCREEN 6: Dietary Preferences** 🥗

### Question
"Do you follow any specific diet?"

### Options
**Type:** Multi-select chips/tags

- None
- Vegetarian 🥕
- Vegan 🌱
- Pescatarian 🐟
- Keto/Low-Carb
- Paleo
- Mediterranean
- Gluten-Free
- Dairy-Free
- Halal
- Kosher
- Low-Sodium
- Diabetic-Friendly
- Other (text input appears)

### Helper Text
"We'll filter food suggestions to match your preferences"

### Validation
- None required (optional question)

### Actions
- **Primary Button:** "Continue"
- **Secondary Link:** "Skip"

### Progress: 6 of 12

---

## **SCREEN 7: Food Allergies** ⚠️

### Question
"Do you have any food allergies or intolerances?"

### Options
**Type:** Multi-select with checkboxes

- None
- Peanuts 🥜
- Tree Nuts (Almonds, Cashews, etc.)
- Dairy/Milk 🥛
- Eggs 🥚
- Soy
- Wheat/Gluten 🌾
- Fish 🐟
- Shellfish 🦐
- Sesame
- Corn
- Sulfites
- Other (text input appears)

### Helper Text
"We'll warn you about potential allergens in scanned foods"

### Visual
⚠️ Important badge/highlight

### Validation
- None required (optional question)

### Actions
- **Primary Button:** "Continue"
- **Secondary Link:** "No Allergies"

### Progress: 7 of 12

---

## **SCREEN 8: Eating Schedule** 🍽️

### Question
"What's your typical eating schedule?"

### Options
**Type:** Single select cards

#### 🌅 Early Bird
- **Description:** "Breakfast by 8 AM, dinner by 6 PM"
- **Typical meals:** 7am, 12pm, 6pm

#### 🕐 Traditional
- **Description:** "Three meals at standard times"
- **Typical meals:** 8am, 1pm, 7pm

#### 🍴 Grazer
- **Description:** "5-6 small meals throughout the day"
- **Typical meals:** Every 2-3 hours

#### 🌙 Night Owl
- **Description:** "Late breakfast, late dinner"
- **Typical meals:** 11am, 4pm, 9pm

#### ⏰ Intermittent Faster
- **Description:** "Eating window"
- **Additional input:** Time range picker (e.g., 12pm-8pm)

#### 🤷 Irregular
- **Description:** "It varies day to day"

### Helper Text
"We'll send meal reminders at the right times for you"

### Validation
- Must select one option

### Actions
- **Primary Button:** "Continue"
- **Secondary Link:** "Skip"

### Progress: 8 of 12

---

## **SCREEN 9: Cooking Habits** 👨‍🍳

### Question
"How often do you cook at home?"

### Options
**Type:** Single select cards with icons

#### 🏠 Daily Cook
- **Label:** "Almost Every Day"
- **Description:** "I prepare most meals at home"

#### 📅 Regular Cook
- **Label:** "Several Times a Week"
- **Description:** "Mix of home cooking and eating out"

#### 🍕 Occasional Cook
- **Label:** "Occasionally"
- **Description:** "Mostly eat out or buy pre-made meals"

#### 🚫 Rarely Cook
- **Label:** "Rarely/Never"
- **Description:** "I mostly eat out, order in, or meal prep services"

### Helper Text
"This helps us suggest relevant foods and recipes"

### Validation
- Must select one option

### Actions
- **Primary Button:** "Continue"
- **Secondary Link:** "Skip"

### Progress: 9 of 12

---

## **SCREEN 10: Biggest Challenge** 💭

### Question
"What's your biggest challenge with eating healthy?"

### Subtext
"We'll give you personalized tips to help"

### Options
**Type:** Single select list with icons

- ⏰ **Time** - "Too busy to cook or plan meals"
- 🍰 **Cravings** - "Hard to resist unhealthy foods"
- 📊 **Tracking** - "Difficulty logging food consistently"
- 🤔 **Knowledge** - "Don't know what/how much to eat"
- 💰 **Budget** - "Healthy food is expensive"
- 🍽️ **Portion Control** - "Eating too much at meals"
- 🏢 **Social/Work** - "Eating out with colleagues or friends"
- 🌙 **Late Night Eating** - "Snacking before bed"
- 😟 **Emotional Eating** - "Eating when stressed or bored"
- 🎯 **Consistency** - "Starting strong but losing motivation"
- 🤷 **Other** - (text input appears)

### Helper Text
"Select the one that resonates most with you"

### Validation
- Must select one option

### Actions
- **Primary Button:** "Continue"
- **Secondary Link:** "Skip"

### Progress: 10 of 12

---

## **SCREEN 11: Motivation** 💪

### Question
"Why do you want to track your nutrition?"

### Subtext
"Select all that apply"

### Options
**Type:** Multi-select checkboxes/chips

- ❤️ **Health Reasons** - "Improve overall health"
- 👗 **Fit Better** - "Fit into clothes better"
- 🏃 **Performance** - "Improve athletic performance"
- 💪 **Build Muscle** - "Gain strength and muscle"
- 🧠 **Energy** - "More energy and mental clarity"
- 🩺 **Doctor Recommended** - "Medical advice"
- 👰 **Special Event** - "Wedding, reunion, vacation, etc."
- 🪞 **Confidence** - "Feel more confident"
- 😴 **Sleep Better** - "Improve sleep quality"
- 📈 **General Wellness** - "Overall health and wellness"
- 🎯 **Accountability** - "Stay accountable to my goals"
- 👨‍👩‍👧 **Family** - "Set a good example for my family"

### Helper Text
"We'll celebrate milestones that matter to you"

### Validation
- None required (optional)

### Actions
- **Primary Button:** "Continue"
- **Secondary Link:** "Skip"

### Progress: 11 of 12

---

## **SCREEN 12: Notification Preferences** 🔔

### Question
"How can we help you stay on track?"

### Subtext
"You can change these anytime in settings"

### Options
**Type:** Toggle switches with time pickers

#### ⏰ Meal Reminders
- **Toggle:** ON/OFF
- **Sub-options** (when ON):
  - Breakfast: Time picker (default: 8:00 AM)
  - Lunch: Time picker (default: 12:30 PM)
  - Dinner: Time picker (default: 7:00 PM)

#### 💧 Water Reminders
- **Toggle:** ON/OFF
- **Sub-option:** Frequency (Every 2 hours during waking hours)

#### 📊 Daily Summary
- **Toggle:** ON/OFF
- **Sub-option:** Time picker (default: 9:00 PM)
- **Description:** "End of day progress report"

#### 🔥 Streak Notifications
- **Toggle:** ON/OFF
- **Description:** "Celebrate consecutive tracking days"

#### 🎯 Goal Milestones
- **Toggle:** ON/OFF
- **Description:** "Celebrate achievements and progress"

#### 💡 Tips & Insights
- **Toggle:** ON/OFF
- **Description:** "Weekly nutrition tips and personalized insights"

### Helper Text
"Reminders help you build consistent tracking habits"

### Default State
All toggles ON except Tips & Insights

### Validation
- None required (optional)

### Actions
- **Primary Button:** "Continue"
- **Secondary Link:** "Skip All Notifications"

### Progress: 12 of 12

---

## **SCREEN 13: Review & Calculate** ✨

### Header
"Your Personalized Plan is Ready! 🎉"

### Profile Summary Section

**Your Profile:**
- 👤 Name: [User Name]
- 📅 Age: [XX] years old
- ⚧️ Gender: [Gender]
- 📏 Height: [X'X" / XXXcm]
- ⚖️ Current Weight: [XXX lbs/kg]
- 🏃 Activity: [Activity Level]

### Goal Section

**Your Goal:**
- 🎯 [Lose/Maintain/Gain] Weight
- 📉 Rate: [0.5-2 lbs/week] (if applicable)
- 🎚️ Target: [XXX lbs/kg] (if provided)

### Calculation Results (Highlighted)

**Your Daily Targets:**

#### 🔥 Calories
- **Large number:** 1,800 cal
- **Subtext:** "To [lose/maintain/gain] weight"

#### Macronutrient Breakdown
- 🍗 **Protein:** 120g (27%)
  - Progress bar visualization
- 🍞 **Carbs:** 200g (44%)
  - Progress bar visualization
- 🥑 **Fats:** 58g (29%)
  - Progress bar visualization

### Timeline Estimate (if weight loss/gain goal)

**Estimated Timeline:**
"At this rate, you could reach your goal weight in approximately **12 weeks**"

**Visual:** Simple timeline graphic or progress illustration

### BMR/TDEE Info (Collapsible)

**"How we calculated this" (expandable)**
- BMR (Basal Metabolic Rate): [XXXX] cal
- TDEE (Total Daily Energy Expenditure): [XXXX] cal
- Adjustment for goal: [+/- XXX] cal

### Disclaimer
"Remember: These are estimates. We'll adjust based on your progress."

### Actions
- **Primary Button:** "Start Tracking!" (Large, prominent)
- **Secondary Button:** "✏️ Edit Details"

### Next Step
Leads to Dashboard/Home screen

---

## 📊 **Calculation Formulas**

### BMR (Basal Metabolic Rate) - Mifflin-St Jeor Equation

**For Men:**
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
```

**For Women:**
```
BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161
```

### TDEE (Total Daily Energy Expenditure)

```
TDEE = BMR × Activity Multiplier
```

**Activity Multipliers:**
- Sedentary: BMR × 1.2
- Lightly Active: BMR × 1.375
- Moderately Active: BMR × 1.55
- Very Active: BMR × 1.725
- Extra Active: BMR × 1.9

### Daily Calorie Goal

**For Weight Loss:**
```
Daily Goal = TDEE - Deficit
```
- 0.5 lbs/week: -250 cal
- 1 lb/week: -500 cal
- 1.5 lbs/week: -750 cal
- 2 lbs/week: -1000 cal

**Minimum:** Never go below 1200 cal (women) or 1500 cal (men)

**For Weight Gain:**
```
Daily Goal = TDEE + Surplus
```
- 0.5 lbs/week: +250 cal
- 1 lb/week: +500 cal
- 1.5 lbs/week: +750 cal
- 2 lbs/week: +1000 cal

**For Maintenance:**
```
Daily Goal = TDEE
```

### Macronutrient Calculations

**Standard Macro Split:**
- Protein: 25-30% of calories
- Carbs: 40-50% of calories
- Fats: 25-30% of calories

**Conversion:**
- 1g Protein = 4 calories
- 1g Carbs = 4 calories
- 1g Fat = 9 calories

**Example for 1800 calories:**
- Protein: 1800 × 0.27 = 486 cal ÷ 4 = 121.5g
- Carbs: 1800 × 0.44 = 792 cal ÷ 4 = 198g
- Fats: 1800 × 0.29 = 522 cal ÷ 9 = 58g

---

## 🔄 **Skip Logic Flow**

```
Screen 1 (Welcome)
    ↓
Screen 2 (Name)
    ↓
Screen 3 (Age, Gender, Height, Weight)
    ↓
Screen 4 (Activity Level)
    ↓
Screen 5 (Primary Goal)
    ↓
    ├─→ IF "Lose Weight" OR "Gain Weight" → Screen 5a (Weight Details)
    │       ↓
    └─→ ELSE → Screen 6
                ↓
Screen 6 (Dietary Preferences) [Optional - Can Skip]
    ↓
Screen 7 (Allergies) [Optional - Can Skip]
    ↓
Screen 8 (Eating Schedule) [Optional - Can Skip]
    ↓
Screen 9 (Cooking Habits) [Optional - Can Skip]
    ↓
Screen 10 (Biggest Challenge) [Optional - Can Skip]
    ↓
Screen 11 (Motivation) [Optional - Can Skip]
    ↓
Screen 12 (Notifications) [Optional - Can Skip]
    ↓
Screen 13 (Review & Calculate)
    ↓
Dashboard/Home Screen
```

---

## 🎨 **Design Guidelines**

### Visual Consistency
- **Color Scheme:** Emerald Green (#10B981), Bright Blue (#3B82F6), Coral Orange (#F97316)
- **Font:** Inter or SF Pro
- **Card Radius:** 16px
- **Spacing:** 16px base unit
- **Icons:** Lucide or Feather icon set

### Interactive Elements
- **Selection feedback:** Scale animation (1.0 → 1.02) + shadow
- **Progress bar:** Animated, gradient fill
- **Buttons:** Rounded (12px), 48px height minimum
- **Haptic feedback:** On selections and button presses

### Accessibility
- **Text contrast:** WCAG AA minimum
- **Touch targets:** 44×44px minimum
- **Screen reader:** Proper labels for all inputs
- **Keyboard navi