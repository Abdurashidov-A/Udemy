import Skill from "./skill";

function SkillList() {
  return (
    <div className="skill-list">
      <Skill skillist="HTML + CSS 💪" color="blue" />
      <Skill skillist="Web Design 👍" color="burlywood" />
      <Skill skillist="React 💪" color="rgba(0, 0, 255, 0.384)" />
      <Skill skillist="Tailwind 🎨" color="purple" />
      <Skill skillist="SCSS 🖌" color="tomato" />
    </div>
  );
}

export default SkillList;
