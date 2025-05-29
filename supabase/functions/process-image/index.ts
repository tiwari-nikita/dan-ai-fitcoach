import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  // Set CORS headers for preflight requests and actual requests
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Ensure the request is a POST request
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      });
    }

    // Parse the request body. Assuming the image is sent as JSON with a 'imageData' field.
    // For a real implementation, you might handle FormData or Blob directly.
    const { imageData } = await req.json();

    if (!imageData) {
      return new Response(JSON.stringify({ error: "No image data provided" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Function to simulate external API calls for computer vision and OCR
    async function processImageWithVisionAndOCR(base64ImageData: string) {
      // In a real application, you would integrate with a computer vision service
      // like Google Cloud Vision API or AWS Rekognition here.
      // This example simulates the process.

      console.log("Processing image data with mock CV/OCR:", base64ImageData.substring(0, 50) + "...");

      // Simulate API call for food item identification
      // For demonstration, we'll just "identify" a generic food item.
      const identifiedFoodItems = ["generic food item"]; // Replace with actual identification logic

      // Simulate OCR API call for nutritional labels
      // For demonstration, we'll return a mock nutritional label text.
      const mockNutritionalLabelText = `
        Nutrition Facts
        Serving Size 1 cup (228g)
        Amount Per Serving
        Calories 250
        Total Fat 10g 15%
        Saturated Fat 3g 15%
        Trans Fat 0g
        Cholesterol 30mg 10%
        Sodium 300mg 13%
        Total Carbohydrate 30g 10%
        Dietary Fiber 5g 20%
        Total Sugars 12g
        Includes 10g Added Sugars 20%
        Protein 15g
        Vitamin D 2mcg 10%
        Calcium 100mg 8%
        Iron 2mg 10%
        Potassium 400mg 8%
      `; // Replace with actual OCR result

      // Parse the extracted text and identified food items to infer nutrient content
      const inferredNutritionalData = parseNutritionalData(mockNutritionalLabelText, identifiedFoodItems);

      return inferredNutritionalData;
    }

    // Function to parse nutritional data from OCR text
    function parseNutritionalData(ocrText: string, foodItems: string[]) {
      const data: { [key: string]: any } = {
        calories: 0,
        protein_g: 0,
        carbohydrates_g: 0,
        fat_g: 0,
        fiber_g: 0,
        sugar_g: 0,
        sodium_mg: 0,
        vitamins: {},
        minerals: {},
        notes: `Data inferred from: ${foodItems.join(", ")}. OCR text processed.`,
      };

      // Regex patterns to extract common nutritional information
      const patterns = {
        calories: /Calories\s+(\d+)/i,
        totalFat: /Total Fat\s+(\d+)g/i,
        saturatedFat: /Saturated Fat\s+(\d+)g/i,
        cholesterol: /Cholesterol\s+(\d+)mg/i,
        sodium: /Sodium\s+(\d+)mg/i,
        totalCarbohydrate: /Total Carbohydrate\s+(\d+)g/i,
        dietaryFiber: /Dietary Fiber\s+(\d+)g/i,
        totalSugars: /Total Sugars\s+(\d+)g/i,
        protein: /Protein\s+(\d+)g/i,
        vitaminD: /Vitamin D\s+(\d+)mcg/i,
        calcium: /Calcium\s+(\d+)mg/i,
        iron: /Iron\s+(\d+)mg/i,
        potassium: /Potassium\s+(\d+)mg/i,
      };

      for (const key in patterns) {
        const match = ocrText.match(patterns[key as keyof typeof patterns]);
        if (match && match[1]) {
          const value = parseInt(match[1], 10);
          switch (key) {
            case "calories":
              data.calories = value;
              break;
            case "totalFat":
              data.fat_g = value;
              break;
            case "dietaryFiber":
              data.fiber_g = value;
              break;
            case "totalSugars":
              data.sugar_g = value;
              break;
            case "protein":
              data.protein_g = value;
              break;
            case "sodium":
              data.sodium_mg = value;
              break;
            case "totalCarbohydrate":
              data.carbohydrates_g = value;
              break;
            case "vitaminD":
              data.vitamins.vitamin_d_mcg = value;
              break;
            case "calcium":
              data.minerals.calcium_mg = value;
              break;
            case "iron":
              data.minerals.iron_mg = value;
              break;
            case "potassium":
              data.minerals.potassium_mg = value;
              break;
            // Add more cases for other nutrients as needed
          }
        }
      }
      return data;
    }

    const nutritionalData = await processImageWithVisionAndOCR(imageData);

    return new Response(JSON.stringify(nutritionalData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing image:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});