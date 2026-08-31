# signed-in-pit

Live “who is signed in on this pair.”

```
cd worker
npx wrangler login
npx wrangler deploy
```

Copy the URL you get (`https://signed-in-pit.JOUW-SUBDOMAIN.workers.dev`) and paste it in Quote.com → Pit URL, or set it in the desktop:

```
localStorage.setItem("signed-in-pit-url", "https://signed-in-pit.JOUW-SUBDOMAIN.workers.dev")
```

Then open the same pair on two phones/laptops. Both should see count 2.
