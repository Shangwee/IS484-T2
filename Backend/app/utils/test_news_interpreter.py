from helpers import news_interpreter
import time

news_text = """
scitechdaily.com

Verifying you are human. This may take a few seconds.

scitechdaily.com needs to review the security of your connection before proceeding.
"""

start = time.time()
print(news_interpreter(news_text, 100))
end = time.time()

print(f"Execution time: {end - start} seconds")