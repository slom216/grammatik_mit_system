import { Card } from '../components/common/Card';

export function AboutPage() {
  return (
    <div className="stack prose">
      <h1>About this app</h1>

      <Card title="What this is" titleLevel={2}>
        <p>
          Grammatik mit System is an independent, browser-based course for German grammar
          from A1 to B1. Each chapter contains an explanation, examples, typical mistakes,
          a short summary and at least 24 exercises.
        </p>
      </Card>

      <Card title="Sources and originality" titleLevel={2}>
        <p>
          The curriculum is organised around common A1–B1 German grammar topics, following
          a progression that is standard in German course books. All explanations, example
          sentences, exercises, answer options and translations in this app are written
          for this app.
        </p>
        <p>
          No text, exercise, illustration or page layout is copied from any published
          course book, and this app is not affiliated with, endorsed by or published by
          any textbook publisher.
        </p>
      </Card>

      <Card title="Privacy" titleLevel={2}>
        <p>
          There are no accounts and no server. Your progress, review schedule and settings
          are stored in your browser&apos;s localStorage and never leave your device.
          Deleting your browser data or using the reset button in Settings removes
          everything.
        </p>
      </Card>

      <Card title="Accessibility" titleLevel={2}>
        <p>
          The app is operable with the keyboard alone, announces answer feedback to screen
          readers, never signals correctness through colour alone, and respects the system
          setting for reduced motion.
        </p>
      </Card>
    </div>
  );
}
