
sudo apt update
sudo apt install python3 python3-pip


Set Your OpenAI API Key

You can securely store your API key as an environment variable in your terminal. Add the following line to your .bashrc or .zshrc (depending on the shell you're using):

Bash file :
export OPENAI_API_KEY="your_api_key_here"

source ~/.bashrc  # or source ~/.zshrc for zsh users


import openai
import os

# Fetch the OpenAI API key from environment variable
api_key = os.getenv("OPENAI_API_KEY")

# If you don't use environment variables, you can directly set your API key here:
# api_key = "your_api_key_here"

openai.api_key = api_key

def chat_with_gpt(prompt):
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",  # You can choose other models like GPT-4
            prompt=prompt,
            max_tokens=150
        )
        message = response.choices[0].text.strip()
        return message
    except Exception as e:
        return f"Error: {e}"

if __name__ == "__main__":
    user_input = input("You: ")
    while user_input.lower() != 'exit':
        response = chat_with_gpt(user_input)
        print(f"ChatGPT: {response}")
        user_input = input("You: ")



python3 chatgpt.py



screen
python3 chatgpt.py

screen -r

