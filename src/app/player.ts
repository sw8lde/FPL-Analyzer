export interface IPlayer {
  assists: number;
  bonus: number;
  bps: number;
  chance_of_playing_next_round: number;
  chance_of_playing_this_round: number;
  clean_sheets: number;
  code: number;
  cost_change_event: number;
  cost_change_event_fall: number;
  cost_change_start: number;
  cost_change_start_fall: number;
  creativity: number;
  dreamteam_count: number;
  ea_index: number;
  element_type: number;
  ep_next: number;
  ep_this: number;
  event_points: number;
  first_name: string;
  form: number;
  goals_conceded: number;
  goals_scored: number;
  ict_index: number;
  id: number;
  in_dreamteam: boolean;
  influence: number;
  loaned_in: number;
  loaned_out: number;
  loans_in: number;
  loans_out: number;
  minutes: number;
  news: string;
  now_cost: number;
  own_goals: number;
  penalties_missed: number;
  penalties_saved: number;
  photo: string;
  points_per_game: number;
  pos_name: string; // custom
  red_cards: number;
  saves: number;
  second_name: string;
  selected_by_percent: number;
  special: boolean;
  squad_number: number;
  status: string;
  team: number;
  team_name: string; // custom
  team_code: number;
  threat: number;
  total_points: number;
  transfers_diff: number;
  transfers_diff_event: number;
  transfers_in: number;
  transfers_in_event: number;
  transfers_out: number;
  transfers_out_event: number;
  url: string; // custom
  value_added_per_mil: number; // custom
  value_form: number;
  value_season: number;
  web_name: string;
  yellow_cards: number;
}
