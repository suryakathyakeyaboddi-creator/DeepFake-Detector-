from gradio_client import Client, handle_file
import time

class DeepfakeService:
    def __init__(self):
        print("Initializing Gradio Client for SuryaKathyakeyaBoddi/deepfake-detector...")
        # Use direct URL to avoid potential resolution issues
        self.client = Client("https://suryakathyakeyaboddi-deepfake-detector.hf.space")
        print("Gradio Client Initialized.")

    def predict(self, file_path: str, retries=3):
        """
        Sends the file to the Gradio backend for prediction.
        
        Args:
            file_path: The absolute path to the image file.
            retries: Number of retries for network errors.
            
        Returns:
            The prediction result from the model.
        """
        last_exception = None
        for attempt in range(retries):
            try:
                print(f"Sending request for {file_path} (Attempt {attempt + 1}/{retries})...")
                result = self.client.predict(
                    image=handle_file(file_path),
                    api_name="/predict"
                )
                print("Prediction received:", result)
                return result
            except Exception as e:
                print(f"Error during prediction (Attempt {attempt + 1}): {e}")
                last_exception = e
                time.sleep(1) # Wait a bit before retrying
        
        raise last_exception

# Singleton instance for easy import
# In a real app, you might want dependency injection, but this is fine for MVP
# We initialize it lazily or at startup to avoid blocking import if network calls happen in __init__
_service_instance = None

def get_hf_service():
    global _service_instance
    if _service_instance is None:
        _service_instance = DeepfakeService()
    return _service_instance
