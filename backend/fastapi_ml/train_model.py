import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Load dataset
data = pd.read_csv("data/Crop_and_fertilizer_dataset.csv")

# Label Encoding
le_district = LabelEncoder()
le_crop = LabelEncoder()
le_fertilizer = LabelEncoder()

data['District_Name'] = le_district.fit_transform(data['District_Name'])
data['Crop'] = le_crop.fit_transform(data['Crop'])
data['Fertilizer'] = le_fertilizer.fit_transform(data['Fertilizer'])

# Features and labels
X = data[['District_Name', 'Nitrogen', 'Phosphorus', 'Potassium', 'pH', 'Rainfall']]
y_crop = data['Crop']
y_fertilizer = data['Fertilizer']

# Split data
X_train, X_test, y_crop_train, y_crop_test = train_test_split(X, y_crop, test_size=0.2, random_state=42)
_, _, y_fert_train, y_fert_test = train_test_split(X, y_fertilizer, test_size=0.2, random_state=42)

# Train Random Forest models
rf_crop = RandomForestClassifier(n_estimators=200, random_state=42)
rf_fertilizer = RandomForestClassifier(n_estimators=200, random_state=42)

rf_crop.fit(X_train, y_crop_train)
rf_fertilizer.fit(X_train, y_fert_train)

# Save models and encoders
joblib.dump(rf_crop, "model/crop_model.pkl")
joblib.dump(rf_fertilizer, "model/fert_model.pkl")
joblib.dump({
    "district": le_district,
    "crop": le_crop,
    "fertilizer": le_fertilizer
}, "model/encoders.pkl")

print("✅ Models trained and saved successfully!")
