exports.seed = function (knex) {
  return knex("users")
    .del()
    .then(function () {
      return knex("users").insert([
        {
          rank: "O-2",
          fname: "Justin",
          lname: "Law",
          email: "justin.law.1@spaceforce.mil",
          password:
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u",
          token: "",
          role: "Jedi Master",
        },
        {
          rank: "E-6",
          fname: "Mark",
          lname: "Terry",
          email: "mark.terry.7@us.af.mil",
          password:
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u",
          token: "",
          role: "Jedi Master",
          supervisor_id: 6,
        },
        {
          rank: "O-2",
          fname: "Chief",
          lname: "Engineer",
          email: "chief.engineer.9000@spaceforce.mil",
          password:
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u",
          token: "",
          role: "Jedi Knight",
          supervisor_id: 1,
        },
        {
          rank: "E-5",
          fname: "Branch",
          lname: "Lead",
          email: "branch.lead.9000@spaceforce.mil",
          password:
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u",
          token: "",
          role: "Padawan",
          supervisor_id: 3,
        },
        {
          rank: "E-4",
          fname: "SEIT",
          lname: "Segment",
          email: "seit.segment.9000@spaceforce.mil",
          password:
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u",
          token: "",
          role: "Padawan",
          supervisor_id: 4,
        },
        {
          rank: "O-1",
          fname: "Alden",
          lname: "Davidson",
          email: "alden.davidson.1@spaceforce.mil",
          password:
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u",
          token: "",
          role: "Padawan",
        },
        {
          rank: "E-4",
          fname: "Ground",
          lname: "Segment",
          email: "ground.segment.9000@spaceforce.mil",
          password:
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u",
          token: "",
          role: "Padawan",
          supervisor_id: 4,
        },
        {
          rank: "E-4",
          fname: "Noah",
          lname: "Loy",
          email: "noah.loy@spaceforce.mil",
          password:
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u",
          token: "",
          role: "Jedi Knight",
          supervisor_id: 7,
        },
        {
          rank: "O-2",
          fname: "Andrew",
          lname: "Pham",
          email: "andrew.pham.3@spaceforce.mil",
          password:
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u",
          token: "",
          role: "Jedi Knight",
          supervisor_id: 3,
        },
      ]);
    });
};
