from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import uvicorn
import os
import hashlib
import asyncio
import base64
import io
from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation
import aiosqlite
import sqlite3

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_NAME = "activity_sessions.db"

def init_db():
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    # Sessions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        sessionID TEXT PRIMARY KEY
    );
    """)

    # Activities table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS activities (
        activityID INTEGER PRIMARY KEY AUTOINCREMENT,
        sessionID TEXT NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY (sessionID) REFERENCES sessions(sessionID)
    );
    """)

    # Saved Activities table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS saved_activities (
        savedActivityID INTEGER PRIMARY KEY AUTOINCREMENT,
        sessionID TEXT NOT NULL,
        activityImage TEXT NOT NULL,
        title TEXT NOT NULL,
        introduction TEXT,
        materials TEXT,
        instructions TEXT,
        location TEXT,
        mood TEXT,
        participants TEXT,
        timeOfDay TEXT,
        typeOfActivity TEXT,
        FOREIGN KEY (sessionID) REFERENCES sessions(sessionID)
    );
    """)

    conn.commit()
    conn.close()


# Call init_db at the start of your application to ensure the database and tables are created
init_db()

class GenerateRequest(BaseModel):
    location: str
    mood: str
    participants: str
    timeOfDay: str
    typeOfActivity: str

class RegenerateRequest(BaseModel):
    sessionID: str
    location: str
    mood: str
    participants: str
    timeOfDay: str
    typeOfActivity: str

class SaveActivityRequest(BaseModel):
    sessionID: str
    activityImage: str
    title: str
    introduction: str
    materials: str
    instructions: str
    # Prompt Fields
    location: str
    mood: str
    participants: str
    timeOfDay: str
    typeOfActivity: str

class ImageRequest(BaseModel):
    activityTitle: str
    n: int = 1

openai_client = OpenAI(api_key=os.getenv('OPENAI_KEY'))
os.environ['STABILITY_HOST'] = 'grpc.stability.ai:443'
os.environ['STABILITY_KEY'] = 'sk-qKCZwEAZD0DEkIChICCfAAPgqQmNLMdOc1wPnmWapkIUsu7U'
url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"


def generate_id(location, mood, participants, timeOfDay, typeOfActivity):
    """
    Generate a session ID based on the hash of the prompt components.
    """
    prompt_string = f"{location}-{mood}-{participants}-{timeOfDay}-{typeOfActivity}"
    # Use SHA-256 hash function to generate a unique identifier for the given prompt
    sessionID = hashlib.sha256(prompt_string.encode('utf-8')).hexdigest()
    return sessionID

async def generate_activity(sessionID, location, mood, participants, timeOfDay, typeOfActivity):
    system_prompt = f"""
        Utilizing your extensive knowledge and creativity, develop a distinctive and imaginative activity based on {typeOfActivity}. 
        This activity should be perfectly suited for {participants} participant(s) in a friends relationship. 
        Strive for an experience that is not just in harmony with a {mood} mood but also stands out as memorable and unique. 
        Consider integrating inventive ideas or elements that diverge from the norm, ensuring it is achievable within a [Budget] budget. 
        The activity will take place in {location} during {timeOfDay}, presenting a chance to craft creative scenarios that enrich the theme. 
        Your objective is to propose an innovative and surprising concept for this activity, promoting delightful surprises and engaging experiences.
        (Every activity generated should adhere to the format below exactly)

        FORMAT:

        Activity:
        Provide a simple title for the activity.

        Introduction:
        Write a detailed introduction that sets the stage for the activity, encapsulating its essence and appeal.

        Materials:
        (List up to 5 essential materials or items necessary for the activity, keeping in mind the uniqueness of the experience.)
        - Material 1
        - Material 2
        - Material 3
        - Material 4
        - Material 5
        
        Instructions:
        (Offer 5 clear, concise instructions, each one sentence long, detailing the key steps of the activity, ensuring they are original and engaging.)
        1. Instruction 1
        2. Instruction 2
        3. Instruction 3
        4. Instruction 4
        5. Instruction 5

        Note:
        Insert a short note here
    """

    # Connect to the SQLite database
    async with aiosqlite.connect(DATABASE_NAME) as db:
        await db.execute("INSERT OR IGNORE INTO sessions (sessionID) VALUES (?)", (sessionID,))
        await db.commit()
        
        cursor = await db.execute("SELECT content FROM activities WHERE sessionID = ?", (sessionID,))
        activities = await cursor.fetchall()
        
        # If activities exist for this session, use them to continue the conversation
        if activities:
            messages = [{"role": "system", "content": system_prompt}] + [{"role": "assistant", "content": act[0]} for act in activities]
        else:
            messages = [{"role": "system", "content": system_prompt}]
        
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=1,
            max_tokens=1024,
        )
        activity_content = response.choices[0].message.content.strip()

        # Save the new activity in the database
        await db.execute("INSERT INTO activities (sessionID, content) VALUES (?, ?)", (sessionID, activity_content))
        await db.commit()
        
    return activity_content

@app.post("/generate")
async def generate(data: GenerateRequest):
    sessionID = generate_id(data.location, data.mood, data.participants, data.timeOfDay, data.typeOfActivity)
    print(sessionID)
    generated_text = await generate_activity(
        sessionID=sessionID,
        location=data.location, 
        mood=data.mood, 
        participants=data.participants, 
        timeOfDay=data.timeOfDay, 
        typeOfActivity=data.typeOfActivity
    )
    return {'response': generated_text, 'sessionID': sessionID}

@app.post("/regenerate")
async def regenerate(data: RegenerateRequest):
    generated_text = await generate_activity(
        sessionID=data.sessionID,
        location=data.location, 
        mood=data.mood, 
        participants=data.participants, 
        timeOfDay=data.timeOfDay, 
        typeOfActivity=data.typeOfActivity
    )
    return {'response': generated_text}


@app.post("/generate_image")
async def generate_image(data: ImageRequest):
    print("Received data:", jsonable_encoder(data))
    
    max_attempts = 3
    attempt = 0

    while attempt < max_attempts:
        try:
            # Increment attempt count
            attempt += 1

            # Set up our connection to the API.
            stability_api = client.StabilityInference(
                key=os.environ['STABILITY_KEY'], # API Key reference.
                verbose=True, # Print debug messages.
                engine="stable-diffusion-xl-1024-v1-0", # Set the engine to use for generation.
            )

            images = stability_api.generate(
                prompt="oil painting style of" + data.activityTitle,
                steps=40,
                cfg_scale=5.0,
                seed=0,
                width=1024,
                height=1024,
                samples=data.n,
                sampler=generation.SAMPLER_K_DPMPP_2M
            )

            for resp in images:
                for artifact in resp.artifacts:
                    if artifact.finish_reason == generation.FILTER:
                        raise ValueError("Request activated the API's safety filters.")
                    if artifact.type == generation.ARTIFACT_IMAGE:
                        img_data = io.BytesIO(artifact.binary)
                        img_base64 = base64.b64encode(img_data.getvalue()).decode('utf-8')
                        return JSONResponse(content={"image": img_base64}, media_type="application/json")

            # If we reach this point without returning, no image was generated
            if attempt == max_attempts:
                # No image generated after max attempts, return default "no image" response
                return JSONResponse(content={"message": "No image was generated after multiple attempts."}, status_code=500)

        except Exception as e:
            print(f"Attempt {attempt} failed: {e}")
            # Optionally add a short delay before retrying
            await asyncio.sleep(1)

    # If we've exhausted retries, return a default "no image" response
    return JSONResponse(content={"message": "Failed to generate an image after retries."}, status_code=500)

@app.post("/save_activity")
async def save_activity(data: SaveActivityRequest):
    print(data) 
    async with aiosqlite.connect(DATABASE_NAME) as db:
        await db.execute("""
            INSERT INTO saved_activities (
                sessionID, activityImage, title, introduction, materials, instructions,
                location, mood, participants, timeOfDay, typeOfActivity
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.sessionID, data.activityImage, data.title, data.introduction, data.materials, data.instructions,
            data.location, data.mood, data.participants, data.timeOfDay, data.typeOfActivity
        ))
        await db.commit()
    
    return {"message": "Activity saved successfully"}

@app.get("/get_activity/{sessionID}/{savedActivityID}")
async def get_activity(sessionID: str, savedActivityID: int):
    async with aiosqlite.connect(DATABASE_NAME) as db:
        cursor = await db.execute("""
            SELECT * FROM saved_activities 
            WHERE sessionID = ? AND savedActivityID = ?
        """, (sessionID, savedActivityID ))
        activity = await cursor.fetchone()
        if activity:
            return {
                "sessionID": activity[1],
                "activityImage": activity[2],
                "title": activity[3],
                "introduction": activity[4],
                "materials": activity[5],
                "instructions": activity[6],
                "location": activity[7],
                "mood": activity[8],
                "participants": activity[9],
                "timeOfDay": activity[10],
                "typeOfActivity": activity[11],
            }
        else:
            raise HTTPException(status_code=404, detail="Activity not found")


@app.get("/get_saved_activities")
async def get_saved_activities():
    async with aiosqlite.connect(DATABASE_NAME) as db:
        cursor = await db.execute("SELECT savedActivityID, sessionID, activityImage, title, introduction, materials, instructions, location, mood, participants, timeOfDay, typeOfActivity FROM saved_activities")
        rows = await cursor.fetchall()
        activities = [
            {
                "savedActivityID": row[0],
                "sessionID": row[1],
                "activityImage": row[2],
                "title": row[3],
                "introduction": row[4],
                "materials": row[5],
                "instructions": row[6],
                "location": row[7],
                "mood": row[8],
                "participants": row[9],
                "timeOfDay": row[10],
                "typeOfActivity": row[11],
            }
            for row in rows
        ]
    return activities


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5000)
