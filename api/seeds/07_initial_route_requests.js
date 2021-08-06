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
          current_stage: 0,
          status: "En route",
          change_log: `Name: E-6 Banks, Date: ${new Date().toGMTString()},
          Comments: Drafted package, ready for CSS!\n`,
        },
        {
          subject: "Amn Whiffy's Quarterly Package",
          initiator_id: 9,
          route_template_id: 3,
          comments: "Drafted package, ready for CSS!",
          current_stage: 1,
          status: "En route",
          change_log: `Name: E-6 Banks, Date: ${new Date().toGMTString()},
          Comments: Drafted package, ready for CSS!\nName: E-6 Banks, Date: ${new Date().toGMTString()},
          Comments: CSS Approved!\n`,
        },
      ]);
    })
    .then(function () {
      return knex("request_stages").insert([
        {
          name: "Supervisor Rewrite",
          suspense_hours: 72, // 3 days
          instructions:
            "Please review the attached rewards package, and approve the package for submittal to the CC.",
          status: "Pending Action",
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
        {
          name: "Supervisor Rewrite",
          suspense_hours: 72, // 3 days
          instructions:
            "Please review the attached rewards package, and approve the package for submittal to the CC.",
          status: "Approved",
          request_id: 2,
        },
        {
          name: "CC Approval",
          suspense_hours: 72, // 3 days
          instructions:
            "Please review the attached rewards package, and approve the package for submittal to the Group.",
          status: "Pending Action",
          request_id: 2,
        },
      ]);
    })
    .then(function () {
      return knex("request_substages").insert([
        {
          group_id: 2, // CSS
          request_stage_id: 1,
          status: "Pending Action",
        },
        {
          group_id: 1, // CC
          request_stage_id: 2,
          status: "Pending Action",
        },
        {
          supervisor_id: 2, // CSS
          request_stage_id: 3,
          status: "Approved",
          notes:
            "Made edits and attached, think we got a group winner over here.",
          completed_at: new Date().toGMTString(),
        },
        {
          group_id: 1, // CC
          request_stage_id: 4,
          status: "Pending Action",
        },
      ]);
    });
};
