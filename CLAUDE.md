# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint/Test Commands
- Frontend: `npm start` - Start the React development server
- Backend: `python Backend/run.py` - Run the Flask backend server
- Python tests: `cd Backend && python -m pytest tests/test_*.py` - Run all tests
- Single test: `cd Backend && python -m pytest tests/test_entity.py` - Run specific test
- Coverage: `cd Backend && python -m coverage run -m pytest && coverage report`

## Code Style Guidelines
### Python (Backend)
- Imports: standard library → third-party → application modules
- Naming: snake_case for variables/functions, PascalCase for classes
- Error handling: Use try-except blocks with specific exceptions
- Models: Define relationships and properties clearly
- Routes: Group by feature in separate blueprints

### JavaScript/React (Frontend)
- Imports: React → third-party → components → hooks → utilities
- Components: Use functional components with hooks
- Naming: PascalCase for components, camelCase for variables/functions
- State: Use useState and useEffect for state management
- API calls: Use the useFetch custom hook for data fetching
- Error handling: Implement loading/error states in components