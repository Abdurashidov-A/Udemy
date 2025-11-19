const Skill = (props) => {
  return (
    <div className="skill" style={{ backgroundColor: props.color }}>
      {props.skillist}
    </div>
  );
};

export default Skill;
