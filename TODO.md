# Fix Database Insert Issue
Status: [In Progress]

## Steps:
- [x] 1. Diagnosis complete: Mock auth in client prevents API calls
- [ ] 2. Read .env.example for DB setup reference  
- [ ] 3. Edit client/src/contexts/AuthContext.jsx: Replace mock with real /api/users/register & login
- [ ] 4. Edit client/src/components/Auth/Register.jsx: Better error handling from API
- [ ] 5. Edit client/src/components/Auth/Login.jsx: Implement real login API
- [ ] 6. Instructions: Create server/.env, setup MySQL educationdb + schema
- [ ] 7. Test: npm run dev server/client, register user, check DB inserts
- [ ] 8. Mark complete
