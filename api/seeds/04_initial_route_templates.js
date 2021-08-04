exports.seed = function (knex) {
  return knex("route_templates")
    .del()
    .then(function () {
      return knex("route_templates").insert([
        {
          name: "Engineering Review Board",
          group_id: 7,
          instructions:
            "Please provide the technical documentation you are putting up for ERB, as well as a CRM template and any other reference documentation required to properly review your change proposal(s). Please note that it is recommended that you provide a summarized version of your change proposal(s) in document or powerpoint form for the reviewers quick reference.",
        },
        {
          name: "Configuration Control Board",
          group_id: 7,
          instructions:
            "Please provide the technical documentation you are putting up for CCB, as well as a CRM template and any other reference documentation required to properly review your change proposal(s). Please note that it is recommended that you provide a summarized version of your change proposal(s) in document or powerpoint form for the reviewers quick reference.",
        },
        {
          name: "Quarterly Awards Package",
          group_id: 2,
          instructions:
            "Categories include; Junior Enlisted (E1 – E4) TBD, NCO (E5 – E6) , SNCO (E7 – E8), CGO (O1 – O3) and FGO (O4 – O5) awards.\n" +
            "Each division DCOS OPS, DCOS SPT, DCOS Plans, Command Group, NCIA, DACCC, CAOC-TJ, CAOC-UE and JAPCC may submit only one nominee per category to compete.  Please ensure your package is submitted through your division chain of command.\n" +
            "Please submit your nominee's AF Form 1206 on attached form, 5 lines maximum, primarily focused upon the Leadership and Primary Duty.  Category header should not be included, bullets only.  Significant Self Improvement and/or Base/Community involvement may be included as OPTIONAL, but will take the place of one of the 5 bullets (5 max). Please submit through your division chain of command.\n" +
            "Name your 1206: 2nd qtr_Rank_Last, First name_Duty location.",
        },
      ]);
    });
};
