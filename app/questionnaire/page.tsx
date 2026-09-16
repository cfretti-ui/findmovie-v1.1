import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QuestionnaireFlow } from "@/components/questionnaire/QuestionnaireFlow";

export const metadata = {
  title: "Find a movie · FindMovie",
  description: "Answer a few questions to discover your next movie.",
};

export default function QuestionnairePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <QuestionnaireFlow />
      </main>
      <Footer />
    </>
  );
}


