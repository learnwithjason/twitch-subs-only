export function App() {
  return (
    <>
      <h1>Subscribers Only</h1>
      <a
        href="https://id.twitch.tv/oauth2/authorize?client_id=ypmkcnzeb83abi7x8eoj9hg2x8efqa&redirect_uri=https://twitch-subs-only.netlify.app/.netlify/functions/twitch-oauth&response_type=code&scope=user:read:subscriptions"
        class="link"
      >
        Log In With Twitch
      </a>
    </>
  );
}
