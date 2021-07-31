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
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u", // 12345678aA!
          token: "",
          role: "Jedi Master",
        },
        {
          rank: "E-6",
          fname: "Mark",
          lname: "Terry",
          email: "mark.terry.7@us.af.mil",
          password:
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u", // 12345678aA!
          token: "",
          role: "Jedi Master",
        },
        {
          rank: "O-3",
          fname: "Alden",
          lname: "Davidson",
          email: "alden.davidson.9000@spaceforce.mil",
          password:
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u", // 12345678aA!
          token: "",
          role: "Jedi Knight",
          supervisor_id: 1,
        },
        {
          rank: "E-5",
          fname: "Bob",
          lname: "Banks",
          email: "bob.banks.9000@spaceforce.mil",
          password:
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u", // 12345678aA!
          token: "",
          role: "Padawan",
          supervisor_id: 3,
        },
        {
          rank: "E-3",
          fname: "Maynard",
          lname: "Snuffy",
          email: "maynard.snuffy.9000@spaceforce.mil",
          password:
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u", // 12345678aA!
          token: "",
          role: "Padawan",
          supervisor_id: 4,
        },
        {
          rank: "O-4",
          fname: "",
          lname: "Lazer",
          email: "maj.lazer.9000@spaceforce.mil",
          password:
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u", // 12345678aA!
          token: "",
          role: "Padawan",
        },
        {
          rank: "E-6",
          fname: "Joe",
          lname: "Schmoe",
          email: "joe.schmoe.9000@spaceforce.mil",
          password:
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u", // 12345678aA!
          token: "",
          role: "Padawan",
          supervisor_id: 4,
        },
        {
          rank: "GS-09",
          fname: "Tanzia",
          lname: "Eusufzai",
          email: "tanzia.eusufzai.9000@spaceforce.mil",
          password:
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u", // 12345678aA!
          token: "",
          role: "Padawan",
          supervisor_id: 7,
        },
        {
          rank: "NH-03",
          fname: "Rick",
          lname: "Roll",
          email: "rick.roll.9000@spaceforce.mil",
          password:
            "$2b$12$yEg4Jg97h7gPxD0A5DYdnucUzx6Sojbuw.SqlB57uqrb.R7haHB1u", // 12345678aA!
          token: "",
          role: "Padawan",
          supervisor_id: 2,
        },
      ]);
    });
};
