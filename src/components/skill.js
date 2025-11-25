const Skill = ({ skill, color, level }) => {
  return (
    <div className="skill" style={{ backgroundColor: color }}>
      {skill}
      <p>
        {level === "beginner" && "👶"}
        {level === "intermediate" && "👍"}
        {level === "advanced" && "💪"}
      </p>
    </div>
  );
};

export default Skill;
