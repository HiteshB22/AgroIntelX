def calculate_soil_health(n, p, k, ph, rainfall):
    score = 0
    if 50 <= n <= 100: score += 20
    elif 30 <= n < 50 or 100 < n <= 150: score += 10

    if 40 <= p <= 80: score += 20
    elif 20 <= p < 40 or 80 < p <= 120: score += 10

    if 50 <= k <= 100: score += 20
    elif 30 <= k < 50 or 100 < k <= 150: score += 10

    if 6.0 <= ph <= 7.5: score += 20
    elif 5.5 <= ph < 6.0 or 7.5 < ph <= 8.0: score += 10

    if 700 <= rainfall <= 1200: score += 20
    elif 500 <= rainfall < 700 or 1200 < rainfall <= 1500: score += 10

    # Determine status
    if score >= 80:
        status = "🌱 Excellent Soil Health"
    elif score >= 60:
        status = "Good"
    elif score >= 40:
        status = "Moderate"
    else:
        status = "Poor"

    # Create detailed analysis string
    details = (
        f"🧭 Soil Health Analysis: "
        f"Nitrogen: {'Moderate' if 30 <= n <= 100 else 'Low/High'}, "
        f"Phosphorus: {'Moderate' if 20 <= p <= 80 else 'Low/High'}, "
        f"Potassium: {'Moderate' if 30 <= k <= 100 else 'Low/High'}, "
        f"Soil pH: {ph}, "
        f"Rainfall: {'Moderate' if 500 <= rainfall <= 1200 else 'Low/High'}"
    )

    return score, status, details
