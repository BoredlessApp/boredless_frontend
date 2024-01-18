from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import uvicorn
import os
import uuid
import asyncio
from difflib import SequenceMatcher

app = FastAPI()
chunks_lock = asyncio.Lock()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chunks_store = {}
previous_responses = {}  # Dictionary to store previous responses for each prompt

class GenerateRequest(BaseModel):
    prompt: str

class RegenerateRequest(BaseModel):
    prompt: str

class DalleRequest(BaseModel):
    prompt: str
    activityTitle: str
    activityIntro: str
    n: int = 1

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def generate_request_key(prompt):
    return f"{uuid.uuid4()}_{hash(prompt)}"

# Function to check similarity between two texts
def is_similar(text1, text2, threshold=0.8):
    return SequenceMatcher(None, text1, text2).ratio() > threshold

async def generate_activity(prompt, regenerate=False):
    max_attempts = 5
    attempt = 0

    while attempt < max_attempts:
        attempt += 1
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": 
                """
                    You will provide unique, creative, and exciting activities for people based on the parameters given by the user.
                    (Every activity generated should adhere to the format below exactly)

                    FORMAT:

                    Activity:
                    Title of the activity goes here

                    Introduction:
                    Insert a detailed introduction here

                    Materials:
                    (Maximum 5 short materials)
                    - Material 1
                    - Material 2
                    - Material 3
                    - Material 4
                    - Material 5
                    
                    Instructions:
                    (Maximum 5 instructions 1 sentence each)
                    1. Instruction 1
                    2. Instruction 2
                    3. Instruction 3
                    4. Instruction 4
                    5. Instruction 5

                    Note:
                    Insert a short note here
                """},
                {"role": "user", "content": prompt}
            ],
            temperature=1,
            max_tokens=1024,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        generated_text = response.choices[0].message.content.strip()

        if regenerate and any(is_similar(generated_text, past_response) for past_response in previous_responses.get(prompt, [])):
            print("Generated text is too similar to previous responses, regenerating...")
            continue

        if prompt not in previous_responses:
            previous_responses[prompt] = []
        previous_responses[prompt].append(generated_text)
        return generated_text

    raise HTTPException(status_code=500, detail="Unable to generate a unique activity")

@app.post("/generate")
async def generate(data: GenerateRequest):
    prompt = data.prompt
    generated_text = await generate_activity(prompt)

    chunks = generated_text.split()
    request_key = generate_request_key(prompt)
    chunks_store[request_key] = chunks
    first_chunk = chunks_store[request_key].pop(0) if chunks_store[request_key] else None
    
    if first_chunk is None:
        return {'response': '', 'message': 'No more chunks'}
    
    return {
        'response': first_chunk,
        'request_key': request_key
    }

@app.post("/regenerate")
async def regenerate(data: RegenerateRequest):
    prompt = data.prompt
    generated_text = await generate_activity(prompt, regenerate=True)

    chunks = generated_text.split()
    request_key = generate_request_key(prompt)
    chunks_store[request_key] = chunks
    first_chunk = chunks_store[request_key].pop(0) if chunks_store[request_key] else None
    
    if first_chunk is None:
        return {'response': '', 'message': 'No more chunks'}
    
    return {
        'response': first_chunk,
        'request_key': request_key
    }

@app.post("/generate_image")
async def generate_image(data: DalleRequest):
    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=data.prompt + '\n' + "Based on these parameters, generate an image with pixel art style using the following title and description:" + '\n' + "Title:\n" + data.activityTitle + '\n' + "Description:\n" + data.activityIntro,
            n=data.n,
            size="1024x1024"  
        )
        # Extract the image URL or the image data from the response
        # Depending on your needs, you might send back the URL or the image data itself
        image_data = response.data  # This might vary depending on the response structure
        return {"images": image_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/next_chunk/{request_key}")
async def next_chunk(request_key: str):
    if request_key not in chunks_store or not chunks_store[request_key]:
        return {'response': '', 'message': 'No more chunks'}

    next_chunk = chunks_store[request_key].pop(0)
    return {'response': next_chunk}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5000)
