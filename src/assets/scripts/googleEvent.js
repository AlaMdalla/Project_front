const CLIENT_ID="919577438054-p5mt9dr84a9f734eu4to6nq2joqj86of.apps.googleusercontent.com";
const API_KEY="AIzaSyANwbhcT9w1CUHDUBwHyElwSlHtNdkbBTg";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
  const SCOPES = "https://www.googleapis.com/auth/calendar";
  const  name="";
  function gapiLoaded() {
    gapi.load("client", initializeGapiClient);
  }
  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
  }
  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: "", // defined later
    });
    gisInited = true;
  }
  function createGoogleEvent(eventDetails) {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      await scheduleEvent(eventDetails);
    };
    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      tokenClient.requestAccessToken({ prompt: "" });
    }
  }
  function scheduleEvent(eventDetails) {
    const event = {
      summary:eventDetails.title,
      location: "tunis",
      description: eventDetails.description,
      start: { 
        
        dateTime: eventDetails.startTime,
        timeZone: "Africa/Tunis"
,
      },
      end: {
        dateTime: eventDetails.endTime,
        timeZone: "Africa/Tunis"
,
      },
      recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
      attendees: [{ email: eventDetails.email }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };
    const request = gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });
    request.execute(function (event) {
      console.info("Event created: " + event.htmlLink);
    });
  }