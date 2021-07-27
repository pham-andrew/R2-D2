exports.seed = function (knex) {

  return knex("memberships")
    .del()
    .then(function () {
      return knex("memberships").insert([
        {
          user_id: 6, // Maj Lazer
          group_id: 1 // CC
        },
        {
          user_id: 2, // Mark
          group_id: 2 // CSS
        },
        {
          user_id: 1, // Justin
          group_id: 3 // Division
        },
        {
          user_id: 2, // Alden
          group_id: 4 // Chief Engineer
        },
        {
          user_id: 4, // Bob
          group_id: 5 // Branch
        },
        {
          user_id: 5, // Maynard
          group_id: 6 // SEIT Segment
        },
        {
          user_id: 7, // Joe
          group_id: 7 // Ground Segment
        },
        {
          user_id: 8, // Tanzia
          group_id: 7 // Engineer
        },
      ]);
  });
};