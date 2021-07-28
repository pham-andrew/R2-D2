exports.seed = function (knex) {
  return knex("substage_templates")
    .del()
    .then(function () {
      return knex("substage_templates").insert([
        {
          group_id: 6, // SEIT Segment
          stage_template_id: 1, //Segment Leads
        },
        {
          group_id: 7, // Ground Segment
          stage_template_id: 1, //Segment Leads
        },
        {
          group_id: 5, // Branch
          stage_template_id: 2, // Branch
        },
        {
          group_id: 4, // Chief Engineer
          stage_template_id: 3, // Chief Engineer
        },
        {
          group_id: 6, // SEIT Segment
          stage_template_id: 4, // Segment Leads
        },
        {
          group_id: 7, // Ground Segment
          stage_template_id: 4, // Segment Leads
        },
        {
          group_id: 5, // Branch
          stage_template_id: 5, // Branch
        },
        {
          group_id: 4, // Chief Engineer
          stage_template_id: 6, // Chief Engineer
        },
        {
          group_id: 3, // Division
          stage_template_id: 7, // Division
        },
        {
          group_id: 9, // Section
          stage_template_id: 8, // Section
        },
        {
          group_id: 2, // CSS
          stage_template_id: 9, // CSS
        },
        {
          group_id: 1, // CC
          stage_template_id: 10, // CC
        },
      ]);
    });
};
