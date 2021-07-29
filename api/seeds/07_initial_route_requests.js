exports.seed = function (knex) {
  return knex("requests")
    .del()
    .then(function () {
      return knex("requests").insert([
        {
          subject: "Amn Snuffy's Quarterly Package",
          initiator_id: 4,
          route_template_id: 3,
          comments: "Drafted package, ready for CSS!",
          current_stage: 2,
          status: "En route",
          change_log: `Name: SSgt Banks, Date: ${Date.now()}\n
          Comments: Drafted package, ready for CSS!\n\n
          Name: TSgt Terry, Date: ${Date.now()}\n  Comments: Made edits and attached, think we got a group winner over here.`,
        },
      ]);
    })
    .then(function () {
      return knex("request_stages").insert([
        {
          name: "CSS Review",
          suspense_hours: 72, // 3 days
          instructions:
            "Please review the attached rewards package, and approve the package for submittal to the CC.",
          status: "Approved",
          request_id: 1,
        },
        {
          name: "CC Approval",
          suspense_hours: 72, // 3 days
          instructions:
            "Please review the attached rewards package, and approve the package for submittal to the Group.",
          status: "Pending Action",
          request_id: 1,
        },
      ]);
    })
    .then(function () {
      return knex("request_substages").insert([
        {
          group_id: 2, // CSS
          request_stage_id: 1,
          status: "approved",
          notes:
            "Made edits and attached, think we got a group winner over here.",
          user_id: 2,
          completed_at: new Date(),
        },
        {
          group_id: 1, // CC
          request_stage_id: 2,
          status: "Pending Action",
        },
      ]);
    });
};
