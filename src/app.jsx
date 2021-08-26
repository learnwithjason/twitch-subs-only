export function App() {
  return (
    <>
      <h1>Subscribers Only</h1>
      <a href="https://id.twitch.tv/oauth2/authorize?client_id=ypmkcnzeb83abi7x8eoj9hg2x8efqa&redirect_uri=http://localhost:8888/.netlify/functions/twitch-oauth&response_type=code&scope=user:read:subscriptions">
        Log In With Twitch
      </a>

      <h2>Load Twitch User</h2>
      <a href="/.netlify/functions/get-twitch-user">Load Twitch User</a>
    </>
  );
}
