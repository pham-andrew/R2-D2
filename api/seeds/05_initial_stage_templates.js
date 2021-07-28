exports.seed = function (knex) {
  return knex("stage_templates")
    .del()
    .then(function () {
      return knex("stage_templates").insert([
        {
          name: "Segment Leads Approval",
          route_template_id: 1,
          suspense_hours: 168, // 1 week
          instructions:
            "Please review the attached technical documentation and provide any other necessary attachments (CRMs, redlines, etc.) before accepting or rejecting the progression to the next stage. All rejections and regressions to the previous stage must be accompanied by a rationale in your notes section.",
        },
        {
          name: "Branch Approval",
          route_template_id: 1,
          suspense_hours: 168, // 1 week
          instructions:
            "Please review the attached technical documentation and provide any other necessary attachments (CRMs, redlines, etc.) before accepting or rejecting the progression to the next stage. All rejections and regressions to the previous stage must be accompanied by a rationale in your notes section.",
        },
        {
          name: "Chief Engineer Approval",
          route_template_id: 1,
          suspense_hours: 168, // 1 week
          instructions:
            "Please review the attached technical documentation and provide any other necessary attachments (CRMs, redlines, etc.) before accepting or rejecting the progression to the next stage. All rejections and regressions to the previous stage must be accompanied by a rationale in your notes section.",
        },

        {
          name: "Segment Leads Approval",
          route_template_id: 2,
          suspense_hours: 168, // 1 week
          instructions:
            "Please review the attached technical documentation and provide any other necessary attachments (CRMs, redlines, etc.) before accepting or rejecting the progression to the next stage. All rejections and regressions to the previous stage must be accompanied by a rationale in your notes section.",
        },
        {
          name: "Branch Approval",
          route_template_id: 2,
          suspense_hours: 168, // 1 week
          instructions:
            "Please review the attached technical documentation and provide any other necessary attachments (CRMs, redlines, etc.) before accepting or rejecting the progression to the next stage. All rejections and regressions to the previous stage must be accompanied by a rationale in your notes section.",
        },
        {
          name: "Chief Engineer Approval",
          route_template_id: 2,
          suspense_hours: 168, // 1 week
          instructions:
            "Please review the attached technical documentation and provide any other necessary attachments (CRMs, redlines, etc.) before accepting or rejecting the progression to the next stage. All rejections and regressions to the previous stage must be accompanied by a rationale in your notes section.",
        },
        {
          name: "Division Approval",
          route_template_id: 2,
          suspense_hours: 336, // 2 week
          instructions:
            "Please review the attached technical documentation and provide any other necessary attachments (CRMs, redlines, etc.) before accepting or rejecting the progression to the next stage. All rejections and regressions to the previous stage must be accompanied by a rationale in your notes section.",
        },
        {
          name: "Section Review",
          route_template_id: 3,
          suspense_hours: 72, // 3 days
          instructions:
            "Please review the attached rewards package, and approve the package for submittal to the CSS.",
        },
        {
          name: "CSS Review",
          route_template_id: 3,
          suspense_hours: 72, // 3 days
          instructions:
            "Please review the attached rewards package, and approve the package for submittal to the CC.",
        },
        {
          name: "CC Approval",
          route_template_id: 3,
          suspense_hours: 72, // 3 days
          instructions:
            "Please review the attached rewards package, and approve the package for submittal to the Group.",
        },
      ]);
    });
};
