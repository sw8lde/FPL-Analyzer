package com.smartworks.fplanalyzer;

public class Player {
	private String name, team, pos;
	private double  price;
	private int score;
	
	public Player(String name, String team, String pos, double price, int score) {
		this.name = name;
		this.team = team;
		this.pos = pos;
		this.price = price;
		this.score = score;
	}

	public String getName() {
		return name;
	}

	public String getTeam() {
		return team;
	}

	public void setTeam(String team) {
		this.team = team;
	}

	public String getPos() {
		return pos;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

	@Override
	public String toString() {
		return name + " " + team + " " + pos + " " + price + " " + score;
	}
	
}
