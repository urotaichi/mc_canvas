import { CharacterObject } from "../CharacterObject";

export const DYING = 40;
export const BOSS1_DAMAGE_LEFT = 60;
export const BOSS1_DAMAGE_RIGHT = 65;
export const BOSS1_STANDBY = 100;
export const BOSS1_ATTACK_LEFT = 110;
export const BOSS1_ATTACK_RIGHT = 115;
export const BOSS1_MOVING_LEFT = 150;
export const BOSS1_MOVING_RIGHT = 155;

/**
 * 度数法で表された角度を、[0,360)の範囲に収まるよう正規化する
 * @param {number} degree
 */
const normalizeDegree = degree => ((degree % 360) + 360) % 360;

/**
 * 長さが同じ配列をまとめる
 * [1,2,3],[4,5,6]=>[[1,4],[2,5],[3,6]]
 * @param {Array} a
 * @param {Array} b
 */
const zip = (a, b) => {
	if (a.length !== b.length)
		throw new Error("The given arrays do not have the same length.");
	return a.map((v, i) => [v, b[i]]);
};

class Boss extends CharacterObject {
	/*
	 * this.c: 状態
	 * this.c1: タイマー用カウンタ
	 * this.c2: 第2カウンタ(一部で使用)
	 * this.c4: HP
	 */
	move(mp) {
		// ボスが居座るX座標
		const x_standby_left = mp.sl_wx + 96;
		const x_standby_right = mp.sl_wx + 512 - 96 - 32;
		switch (this.c) {
			case DYING:
				// 死亡
				// 消えてからしばらくして人面星が出現する
				if (this.c1 < 20) this.c1++;
				if (this.c1 === 15) {
					if (mp.j_tokugi === 14 || mp.j_tokugi === 15) {
						// シューティングモード、四方向移動モードの場合は直接クリアさせる
						mp.setStageClear();
					} else {
						// 人面星を配置する
						mp.mSet(mp.maps.wx + 256, mp.maps.wy + 128, 2200);
						mp.gs.rsAddSound(13);
					}
				}
				this.pt = 0;
				break;

			case BOSS1_DAMAGE_LEFT:
				// 踏まれた
				this.c1++;
				if (this.c4 <= 0) {
					// 死亡
					if (this.c1 >= 26) {
						this.c = DYING;
						this.c1 = 0;
						// シューティングモード、四方向移動モードの場合は100点加算
						if (mp.j_tokugi === 14 || mp.j_tokugi === 15)
							mp.addScore(100);
						else mp.addScore(10);
						// HPゲージを閉じる
						if (mp.boss_destroy_type === 2) mp.hideGauge();
					}
				} else if (this.c1 >= 11) this.c = BOSS1_MOVING_LEFT;
				this.pt = 1010;
				break;

			case BOSS1_DAMAGE_RIGHT:
				// 右を向いている時に踏まれて死ぬことはない
				this.c1++;
				if (this.c1 >= 11) this.c = BOSS1_MOVING_RIGHT;
				this.pt = 1015;
				break;

			case 67:
				this.vy += 4;
				if (this.vy > 28) this.vy = 28;
				this.x += this.vx;
				this.y += this.vy;
				if (mp.boss_destroy_type == 2) {
					mp.boss_hp = 0;
					mp.showGauge(
						String(mp.boss_hp),
						"" +
							mp.tdb.getValue("boss_name") +
							"  " +
							mp.boss_hp +
							"/" +
							mp.boss_hp_max
					);
				}
				if (this.y >= mp.maps.wy + 320 + 16) {
					this.c = 40;
					this.c1 = 0;
					if (mp.j_tokugi == 14 || mp.j_tokugi == 15)
						mp.addScore(100);
					else mp.addScore(10);
					if (mp.boss_destroy_type == 2) mp.hideGauge();
				}
				if (this.muki == 1) this.pt = 1005;
				else this.pt = 1000;
				break;

			case 70:
				this.c1++;
				if (this.c4 <= 0) {
					if (this.c1 >= 26) {
						this.c = 40;
						this.c1 = 0;
						if (mp.j_tokugi == 14 || mp.j_tokugi == 15)
							mp.addScore(100);
						else mp.addScore(10);
						if (mp.boss_destroy_type == 2) mp.hideGauge();
					}
				} else if (this.c1 >= 11) this.c = 250;
				this.pt = 1110;
				break;

			case 75:
				this.c1++;
				if (this.c1 >= 11) this.c = 255;
				this.pt = 1115;
				break;

			case 77:
				this.vy += 4;
				if (this.vy > 28) this.vy = 28;
				this.x += this.vx;
				this.y += this.vy;
				if (mp.boss_destroy_type == 2) {
					mp.boss_hp = 0;
					mp.showGauge(
						String(mp.boss_hp),
						"" +
							mp.tdb.getValue("boss2_name") +
							"  " +
							mp.boss_hp +
							"/" +
							mp.boss_hp_max
					);
				}
				if (this.y >= mp.maps.wy + 320 + 16) {
					this.c = 40;
					this.c1 = 0;
					if (mp.j_tokugi == 14 || mp.j_tokugi == 15)
						mp.addScore(100);
					else mp.addScore(10);
					if (mp.boss_destroy_type == 2) mp.hideGauge();
				}
				if (this.muki == 1) this.pt = 1105;
				else this.pt = 1100;
				break;

			case 80:
				this.c1++;
				if (this.c4 <= 0) {
					if (this.c1 >= 26) {
						this.c = 40;
						this.c1 = 0;
						if (mp.j_tokugi == 14 || mp.j_tokugi == 15)
							mp.addScore(100);
						else mp.addScore(10);
						if (mp.boss_destroy_type == 2) mp.hideGauge();
					}
				} else if (this.c1 >= 11) this.c = 350;
				this.pt = 1210;
				break;

			case 85:
				this.c1++;
				if (this.c1 >= 11) this.c = 355;
				this.pt = 1215;
				break;

			case 87:
				this.vy += 4;
				if (this.vy > 28) this.vy = 28;
				this.x += this.vx;
				this.y += this.vy;
				if (mp.boss_destroy_type == 2) {
					mp.boss_hp = 0;
					mp.showGauge(
						String(mp.boss_hp),
						"" +
							mp.tdb.getValue("boss3_name") +
							"  " +
							mp.boss_hp +
							"/" +
							mp.boss_hp_max
					);
				}
				if (this.y >= mp.maps.wy + 320 + 16) {
					this.c = 40;
					this.c1 = 0;
					if (mp.j_tokugi == 14 || mp.j_tokugi == 15)
						mp.addScore(100);
					else mp.addScore(10);
					if (mp.boss_destroy_type == 2) mp.hideGauge();
				}
				if (this.muki == 1) this.pt = 1205;
				else this.pt = 1200;
				break;

			case BOSS1_STANDBY:
				if (mp.sl_step == 2 || mp.sl_step == 3)
					if (mp.boss_destroy_type == 2) {
						this.x -= 8;
						if (this.x <= mp.sl_wx + 512 - 128) {
							this.x = mp.sl_wx + 512 - 128;
							var l4 = Math.floor(
								(mp.boss_hp * 200) / mp.boss_hp_max
							);
							mp.showGauge(
								String(l4),
								"" +
									mp.tdb.getValue("boss_name") +
									"  " +
									mp.boss_hp +
									"/" +
									mp.boss_hp_max
							);
							this.c = BOSS1_ATTACK_LEFT;
							this.c1 = 0;
						}
					} else {
						this.c = BOSS1_ATTACK_LEFT;
						this.c1 = 0;
					}
				this.pt = 1000;
				break;

			case BOSS1_ATTACK_LEFT:
				this.boss1Attack(mp, 0);
				this.pt = 1000;
				break;

			case BOSS1_ATTACK_RIGHT:
				this.boss1Attack(mp, 1);
				this.pt = 1005;
				break;

			case BOSS1_MOVING_LEFT:
				this.x -= 14;
				if (this.x <= x_standby_left) {
					this.x = x_standby_left;
					this.c = BOSS1_ATTACK_RIGHT;
					this.c1 = 0;
				}
				this.pt = 1000;
				break;

			case BOSS1_MOVING_RIGHT:
				this.x += 14;
				if (this.x >= x_standby_right) {
					this.x = x_standby_right;
					this.c = BOSS1_ATTACK_LEFT;
					this.c1 = 0;
				}
				this.pt = 1005;
				break;

			case 200:
				if (mp.sl_step == 2 || mp.sl_step == 3)
					if (mp.boss_destroy_type == 2) {
						this.x -= 8;
						if (this.x <= mp.sl_wx + 512 - 128) {
							this.x = mp.sl_wx + 512 - 128;
							var k5 = Math.floor(
								(mp.boss_hp * 200) / mp.boss_hp_max
							);
							mp.showGauge(
								String(k5),
								"" +
									mp.tdb.getValue("boss2_name") +
									"  " +
									mp.boss_hp +
									"/" +
									mp.boss_hp_max
							);
							this.c = 210;
							this.c1 = 0;
						}
					} else {
						this.c = 210;
						this.c1 = 0;
					}
				this.pt = 1100;
				break;

			case 210:
				this.boss2Attack(mp, 0);
				this.pt = 1100;
				if (mp.boss2_type == 6) this.pt = 1101;
				break;

			case 215:
				this.boss2Attack(mp, 1);
				this.pt = 1105;
				if (mp.boss2_type == 6) this.pt = 1106;
				break;

			case 250:
				this.x -= 14;
				if (this.x <= x_standby_left) {
					this.x = x_standby_left;
					this.c = 215;
					this.c1 = 0;
				}
				this.pt = 1100;
				break;

			case 255:
				this.x += 14;
				if (this.x >= x_standby_right) {
					this.x = x_standby_right;
					this.c = 210;
					this.c1 = 0;
				}
				this.pt = 1105;
				break;

			case 300:
				if (mp.sl_step == 2 || mp.sl_step == 3) {
					if (mp.boss_destroy_type == 2) {
						this.x -= 8;
						if (this.x <= mp.sl_wx + 512 - 128) {
							this.x = mp.sl_wx + 512 - 128;
							var l5 = Math.floor(
								(mp.boss_hp * 200) / mp.boss_hp_max
							);
							mp.showGauge(
								String(l5),
								"" +
									mp.tdb.getValue("boss3_name") +
									"  " +
									mp.boss_hp +
									"/" +
									mp.boss_hp_max
							);
							if (
								(mp.boss3_type >= 2 && mp.boss3_type <= 4) ||
								(mp.boss3_type >= 6 && mp.boss3_type <= 8)
							) {
								this.c = 360;
								this.vy = -24;
							} else {
								this.c = 310;
							}
							this.c1 = 0;
							this.c2 = 0;
						}
					} else {
						if (
							(mp.boss3_type >= 2 && mp.boss3_type <= 4) ||
							(mp.boss3_type >= 6 && mp.boss3_type <= 8)
						) {
							this.c = 360;
							this.vy = -24;
						} else {
							this.c = 310;
						}
						this.c1 = 0;
						this.c2 = 0;
					}
				}
				this.pt = 1200;
				break;

			case 310:
				this.boss3Attack(mp, 0);
				this.pt = 1200;
				break;

			case 315:
				this.boss3Attack(mp, 1);
				this.pt = 1205;
				break;

			case 350:
				this.x -= 14;
				if (this.x <= x_standby_left) {
					this.x = x_standby_left;
					if (
						(mp.boss3_type >= 2 && mp.boss3_type <= 4) ||
						(mp.boss3_type >= 6 && mp.boss3_type <= 8)
					) {
						this.c = 365;
						this.vy = -24;
					} else {
						this.c = 315;
					}
					this.c1 = 0;
				}
				this.pt = 1200;
				break;

			case 355:
				this.x += 14;
				if (this.x >= x_standby_right) {
					this.x = x_standby_right;
					if (
						(mp.boss3_type >= 2 && mp.boss3_type <= 4) ||
						(mp.boss3_type >= 6 && mp.boss3_type <= 8)
					) {
						this.c = 360;
						this.vy = -24;
					} else {
						this.c = 310;
					}
					this.c1 = 0;
				}
				this.pt = 1205;
				break;

			case 360:
				if (this.c1 <= 25) {
					if (mp.boss3_type >= 6 && mp.boss3_type <= 8)
						this.pt = 1251;
					else this.pt = 1250;
				} else if (this.c1 === 30) {
					if (mp.boss3_type >= 6 && mp.boss3_type <= 8)
						this.pt = 1256;
					else this.pt = 1255;
				} else {
					this.pt = 1200;
				}
				this.boss3TackleAttack(mp, 0);
				break;

			case 365:
				if (this.c1 <= 25) {
					if (mp.boss3_type >= 6 && mp.boss3_type <= 8)
						this.pt = 1256;
					else this.pt = 1255;
				} else if (this.c1 === 30) {
					if (mp.boss3_type >= 6 && mp.boss3_type <= 8)
						this.pt = 1251;
					else this.pt = 1250;
				} else {
					this.pt = 1205;
				}
				this.boss3TackleAttack(mp, 1);
				break;
		}
	}

	/**
	 * boss1の攻撃中の動作
	 * @param {MainProgram} mp
	 * @param {number} direction ボスの向き 0:左向き 1:右向き
	 */
	boss1Attack(mp, direction) {
		// 左向きなら1 右向きなら-1
		const mirror = direction === 1 ? -1 : 1;

		mp.boss_attack_mode = true;
		this.c1++;
		if (mp.boss_type === 2) {
			// 亀を投げる
			const attack_count = [
				1,
				5,
				7,
				9,
				21,
				91,
				95,
				97,
				99,
				111,
				170,
				180
			];
			const powers = [-2, -4, -6, -8, -2, -2, -4, -6, -8, -2, -4, -2];
			if (this.c1 === 1) mp.gs.rsAddSound(17);
			for (const [count, power] of zip(attack_count, powers)) {
				if (this.c1 === count) {
					mp.tSetBoss(this.x, this.y, 150, power * mirror);
					break;
				}
			}
			if (this.c1 > 250) this.c1 = 250;
		} else if (mp.boss_type === 3) {
			// ヒノララシを投げる
			const attack_count = [5, 20, 35, 50, 65, 80, 95, 110];
			if (this.c1 === 5) mp.gs.rsAddSound(17);
			for (const count of attack_count) {
				if (this.c1 === count) {
					mp.tSetBoss(this.x, this.y, 450, -3 * mirror);
					break;
				}
			}
			if (this.c1 > 250) this.c1 = 250;
		} else if (mp.boss_type === 4) {
			// マリリを投げる
			const attack_count = [1, 15, 29, 81, 95, 109, 165];
			const powers = [-5, -3, -2, -5, -3, -2, -3];
			if (this.c1 === 1) mp.gs.rsAddSound(17);
			for (const [count, power] of zip(attack_count, powers)) {
				if (this.c1 === count) {
					mp.tSetBoss(this.x, this.y, 650, power * mirror);
					break;
				}
			}
			if (this.c1 > 250) this.c1 = 250;
		} else if (mp.boss_type === 5) {
			// がんせきほう
			const attack_count = [
				1,
				8,
				16,
				24,
				32,
				40,
				48,
				64,
				72,
				80,
				88,
				96,
				104,
				112
			];
			const degrees = [
				100,
				80,
				60,
				40,
				20,
				0,
				10,
				30,
				50,
				70,
				60,
				40,
				20,
				0
			];
			if (this.c1 === 1) mp.gs.rsAddSound(17);
			for (const [count, degree] of zip(attack_count, degrees)) {
				if (this.c1 === count) {
					// 左向きの場合は角度に180度足す
					const dd = direction !== 1 ? 180 : 0;
					const rad =
						(normalizeDegree(degree * mirror + dd) * 3.14) / 180;
					const x = Math.floor(Math.cos(rad) * 12);
					const y = Math.floor(Math.sin(rad) * 10);
					mp.mSet2(this.x, this.y + 16, 740, x, y);
					break;
				}
			}
			if (this.c1 >= 200) this.c1 = 0;
		} else {
			// 噴火
			if (this.c1 === 3) mp.gs.rsAddSound(17);
			if (this.c1 === 3) {
				mp.mSet2(this.x, this.y, 500, -4, -18);
				mp.mSet2(this.x, this.y, 500, 4, -18);
			} else if (this.c1 === 14) {
				mp.mSet2(this.x, this.y, 500, -6, -20);
				mp.mSet2(this.x, this.y, 500, 6, -20);
			} else if (this.c1 === 20) {
				mp.mSet2(this.x, this.y, 500, -3, -24);
				mp.mSet2(this.x, this.y, 500, 3, -24);
			} else if (this.c1 >= 28 && this.c1 <= 98) {
				if (this.c1 % 7 === 0)
					mp.mSet2(
						this.x,
						this.y,
						500,
						(-15 + mp.ranInt(20)) * mirror,
						-30
					);
			} else if (this.c1 === 130) {
				const dir = mp.ranInt(8) + 3;
				mp.mSet2(this.x, this.y, 500, dir, -30);
				mp.mSet2(this.x, this.y, 500, -dir, -30);
			}
			if (this.c1 >= 150) this.c1 = 98;
		}
	}

	/**
	 * boss2の攻撃中の動作
	 * @param {MainProgram} mp
	 * @param {number} direction ボスの向き 0:左向き 1:右向き
	 */
	boss2Attack(mp, direction) {
		// 左向きなら1 右向きなら-1
		const mirror = direction === 1 ? -1 : 1;

		mp.boss_attack_mode = true;
		this.c1++;
		if (mp.boss2_type === 2) {
			// バブル光線
			if (this.c1 === 10 || this.c1 === 85 || this.c1 === 215) {
				this.boss2BubbleBeam(mp, 0);
			} else if (this.c1 === 35 || this.c1 === 110 || this.c1 === 295) {
				this.boss2BubbleBeam(mp, 15);
			} else if (this.c1 === 60 || this.c1 === 135 || this.c1 === 375) {
				this.boss2BubbleBeam(mp, 30);
			}
			if (this.c1 > 445) this.c1 = 0;
		} else if (mp.boss2_type === 3) {
			// うずしお
			const whirlpool = d => {
				for (let i = 0; i < 360; i += 90) {
					const attack = direction === 1 ? 980 : 970;
					mp.mSet2(this.x, this.y, attack, i + d, 0);
				}
				mp.gs.rsAddSound(18);
			};
			if (this.c1 === 5 || this.c1 === 125) {
				whirlpool(0);
			} else if (this.c1 === 45) {
				whirlpool(30);
			} else if (this.c1 === 85) {
				whirlpool(60);
			}
			if (this.c1 > 250) this.c1 = 0;
		} else if (mp.boss2_type === 4) {
			// バブル光線連射
			if (this.c1 === 1) {
				mp.gs.rsAddSound(18);
			}
			const attack_count = [1, 8, 16, 24, 32, 56, 72, 80, 88, 96];
			const degrees = [100, 80, 60, 40, 15, 0, 15, 40, 60, 80];
			for (const [count, degree] of zip(attack_count, degrees)) {
				if (this.c1 !== count) continue;
				// 左向きの場合は角度に180度足す
				const dd = direction !== 1 ? 180 : 0;
				// 0から359の間の角度になるようにする
				const degree_normalized = normalizeDegree(degree + dd);
				// 角度にマイナス1をかける
				const degree_inversed = normalizeDegree(degree_normalized * -1);
				// 反転したものとあわせて二発発射する
				const rads = [];
				rads.push((degree_normalized * 3.14) / 180);
				// 反転しても角度が同じ場合は一発しか出さない
				if (degree_normalized !== degree_inversed)
					rads.push((degree_inversed * 3.14) / 180);
				for (const rad of rads) {
					const cos = Math.floor(Math.cos(rad) * 12);
					const sin = Math.floor(Math.sin(rad) * 10);
					mp.mSet2(this.x, this.y, 710, cos, sin);
				}
				break;
			}
			if (this.c1 >= 200) this.c1 = 0;
		} else if (mp.boss2_type === 5) {
			// ハリケンブラスト
			const hurricaneBlast = d => {
				for (let i = 0; i < 360; i += 60) {
					mp.mSet2(this.x, this.y, 901, i + d, 0);
					mp.mSet2(this.x, this.y, 911, 300 - (i + d), 0);
				}
				mp.gs.rsAddSound(18);
			};
			if (this.c1 === 5) {
				hurricaneBlast(10);
			} else if (this.c1 === 45) {
				hurricaneBlast(30);
			} else if (this.c1 === 85) {
				hurricaneBlast(50);
			}
			if (this.c1 > 270) this.c1 = 0;
		} else if (mp.boss2_type === 6) {
			// バブル光線回転連射
			this.boss2Attack6(mp, direction);
		} else if (mp.boss2_type === 7) {
			// 何もしない
			this.c1 = 0;
		} else if (mp.boss2_type === 8) {
			// 水の波動  直進
			if (this.c1 === 5 || this.c1 === 45 || this.c1 === 85) {
				const attack = direction === 1 ? 96 : 95;
				mp.mSet(this.x, this.y, attack);
				mp.gs.rsAddSound(18);
			}
			if (this.c1 > 165) this.c1 = 4;
		} else {
			// 水の波動
			if (
				this.c1 === 5 ||
				this.c1 === 35 ||
				this.c1 === 65 ||
				this.c1 === 110 ||
				this.c1 === 185
			) {
				mp.mSet(this.x, this.y, 90);
				mp.gs.rsAddSound(18);
			}
			if (this.c1 > 185) this.c1 = 110;
		}
	}

	/**
	 * バブル光線
	 * @param {MainProgram} mp
	 * @param {number} direction ずらす角度(度数法)
	 */
	boss2BubbleBeam(mp, direction) {
		for (let i = 0; i < 8; i++) {
			// NOTE: 後方互換性のためMath.PI等ではなく3.14を用いてラジアンに変換する
			const d = ((i * 45 + direction) * 3.14) / 180;
			const cos = Math.floor(Math.cos(d) * 8);
			const sin = -Math.floor(Math.sin(d) * 8);
			mp.mSet2(this.x, this.y - 8, 710, cos, sin);
			mp.gs.rsAddSound(18);
		}
	}

	/**
	 * バブル光線回転連射
	 * @param {MainProgram} mp
	 * @param {number} direction ボスの向き 0:左向き 1:右向き
	 */
	boss2Attack6(mp, direction) {
		// 左向きなら1 右向きなら-1
		const mirror = direction === 1 ? -1 : 1;
		this.c1--;

		if (this.c1 <= 100) this.c2 += 10 * mirror;
		else if (this.c1 <= 200) this.c2 -= 5 * mirror;
		else if (this.c1 <= 300) this.c2 += 2 * mirror;
		else this.c2 -= 2 * mirror;

		if (this.c1 <= 0) {
			mp.gs.rsAddSound(18);
		}

		let rad = null;
		let attacks = [];
		// TODO: もうちょっとだけましにしたい
		if (direction !== 1) {
			// 左向き
			if (this.c1 <= 0) {
				rad = 3.1400001049041748;
			} else if (this.c1 <= 100) {
				attacks = [
					[40, 3.8377780914306641],
					[70, 4.3611111640930176],
					[90, 4.8844447135925293]
				];
			} else if (this.c1 <= 200) {
				attacks = [
					[80, 4.5355558395385742],
					[60, 4.1866669654846191],
					[30, 3.6633334159851074],
					[0, 3.1400001049041748],
					[-40, 2.4422223567962646],
					[-70, 1.918889045715332],
					[-100, 1.3955556154251099]
				];
			} else if (this.c1 <= 300) {
				attacks = [
					[-60, 2.0933334827423096],
					[-30, 2.6166667938232422],
					[0, 3.1400001049041748],
					[30, 3.6633334159851074],
					[60, 4.1866669654846191],
					[90, 4.7100000381469727]
				];
			} else {
				attacks = [
					[60, 4.1866669654846191],
					[30, 3.6633334159851074],
					[0, 3.1400001049041748],
					[-30, 2.6166667938232422],
					[-60, 2.0933334827423096],
					[-90, 1.5700000524520874]
				];
			}
		} else {
			// 右向き
			if (this.c1 <= 0) {
				rad = 0.0;
			} else if (this.c1 <= 100) {
				attacks = [
					[-40, 5.5822224617004395],
					[-70, 5.0588889122009277],
					[-90, 4.5355558395385742]
				];
			} else if (this.c1 <= 200) {
				attacks = [
					[-80, 4.8844447135925293],
					[-60, 5.2333335876464844],
					[-30, 5.7566671371459961],
					[0, 0.0],
					[40, 0.69777780771255493],
					[70, 1.2211111783981323],
					[100, 1.7444444894790649]
				];
			} else if (this.c1 <= 300) {
				attacks = [
					[60, 1.0466667413711548],
					[30, 0.52333337068557739],
					[0, 0.0],
					[-30, 5.7566671371459961],
					[-60, 5.2333335876464844],
					[-90, 4.7100000381469727]
				];
			} else {
				attacks = [
					[-60, 5.2333335876464844],
					[-30, 5.7566671371459961],
					[-0, 0.0],
					[30, 0.52333337068557739],
					[60, 1.0466667413711548],
					[90, 1.5700000524520874]
				];
			}
		}
		for (const [count, r] of attacks) {
			if (this.c2 === count) {
				rad = r;
				break;
			}
		}
		if (rad !== null) {
			const cos = Math.floor(Math.cos(rad) * 12);
			const sin = Math.floor(Math.sin(rad) * 8);
			mp.mSet2(this.x, this.y, 711, cos, sin);
		}

		if (this.c1 <= 0) {
			this.c2 = 0;
			this.c1 = 100;
		} else if (this.c1 <= 100) {
			if (this.c2 * mirror >= 90) {
				this.c2 = 90 * mirror;
				this.c1 = 200;
			}
		} else if (this.c1 <= 200) {
			if (this.c2 * mirror <= -100) {
				this.c2 = -100 * mirror;
				this.c1 = 300;
			}
		} else if (this.c1 <= 300) {
			if (this.c2 * mirror >= 90) {
				this.c2 = 90 * mirror;
				this.c1 = 400;
			}
		} else {
			if (this.c2 * mirror <= -90) {
				this.c2 = -90 * mirror;
				this.c1 = 300;
			}
		}
	}

	/**
	 * boss3の攻撃中の動作(りゅうせいぐん・グレネード)
	 * @param {MainProgram} mp
	 * @param {number} direction ボスの向き 0:左向き 1:右向き
	 */
	boss3Attack(mp, direction) {
		// 左向きなら1 右向きなら-1
		const mirror = direction === 1 ? -1 : 1;

		mp.boss_attack_mode = true;
		this.c1++;
		if (mp.boss3_type === 5) {
			// りゅうせいぐん
			if (this.c1 === 1) mp.gs.rsAddSound(22);
			if (
				this.c1 === 1 ||
				this.c1 === 20 ||
				this.c1 === 40 ||
				this.c1 === 60 ||
				this.c1 === 80 ||
				this.c1 === 100 ||
				this.c1 === 120 ||
				this.c1 === 140
			) {
				const dx = direction === 1 ? 0 : 512 - 32;
				if (this.c1 <= 45)
					mp.mSet2(
						mp.maps.wx + dx - 8 * mp.ranInt(10) * mirror,
						mp.maps.wy - 32,
						740,
						-4 * mirror,
						9
					);
				mp.mSet2(
					mp.maps.wx + dx - 8 * (mp.ranInt(35) + 14) * mirror,
					mp.maps.wy - 32,
					740,
					-4 * mirror,
					9
				);
			} else if (
				this.c1 === 15 ||
				this.c1 === 35 ||
				this.c1 === 55 ||
				this.c1 === 75 ||
				this.c1 === 95 ||
				this.c1 === 115 ||
				this.c1 === 135 ||
				this.c1 === 155
			) {
				const dx = direction === 1 ? 0 : 512 - 32;
				if (this.c1 <= 55)
					mp.mSet2(
						mp.maps.wx + dx - 8 * mp.ranInt(10) * mirror,
						mp.maps.wy - 32,
						740,
						-4 * mirror,
						11
					);
				mp.mSet2(
					mp.maps.wx + dx - 8 * (mp.ranInt(35) + 14) * mirror,
					mp.maps.wy - 32,
					740,
					-4 * mirror,
					11
				);
			}
			if (this.c1 >= 250) this.c1 = 55;
		} else {
			// グレネード
			const attack_count = [1, 15, 29, 65, 80, 105, 147, 520, 530];
			const powers = [-5, -10, -15, -20, -5, -15, -10, 4, -5];
			for (const [count, power] of zip(attack_count, powers)) {
				if (this.c1 === count) {
					mp.mSet2(this.x, this.y, 800, power * mirror, -32);
					mp.gs.rsAddSound(22);
					break;
				}
			}

			if (this.c1 === 15) {
				// 主人公の位置に応じた行動分岐
				if (direction !== 1 && mp.co_j.x > this.x - 64) this.c1 = 500;
				if (direction === 1 && mp.co_j.x < this.x + 64) this.c1 = 500;
			} else if (this.c1 === 237) this.c1 = 0;
			else if (this.c1 >= 530) this.c1 = 1;
		}
	}

	/**
	 * boss3の体当たり攻撃
	 * @param {MainProgram} mp
	 * @param {number} direction ボスの向き 0:左向き 1:右向き
	 */
	boss3TackleAttack(mp, direction) {
		// 左向きなら1 右向きなら-1
		const mirror = direction === 1 ? -1 : 1;

		if (this.c1 < 25) this.c1++;
		// TODO: 消して良いのでは？
		if (direction !== 1 && this.c1 < 5) this.c2 = 0;
		// NOTE: ここのdirection!==1の判定はおそらく元のコードのバグ
		// TODO: リファクタリング中なので挙動維持のため残すが、おそらくdirection !== 1の判定は消して問題ない
		if (
			this.c1 < 25 ||
			(direction !== 1 && this.c1 === 25) ||
			this.c1 === 30
		)
			mp.boss_attack_mode = true;

		// 画面外判定に用いる座標
		const x_border_left = mp.sl_wx + 16;
		const x_border_right = mp.sl_wx + 16 + 512 - 64;
		// ボスが居座るX座標
		const x_standby_left = mp.sl_wx + 96;
		const x_standby_right = mp.sl_wx + 512 - 96 - 32;

		if (this.c1 === 25) {
			// 体当たり 行き
			if (mp.boss3_type === 4 || mp.boss3_type === 8) {
				// ジャンプ移動
				this.x -= 3 * mirror;
				this.vy += 2;
				if (this.vy > 24) this.vy = 24;
				this.y += this.vy;
				if (this.y >= mp.boss_kijyun_y) {
					this.y = mp.boss_kijyun_y;
					this.vy = -24;
					// 画面外に出たら反転する
					if (
						(direction !== 1 && this.x <= x_border_left) ||
						(direction === 1 && this.x >= x_border_right)
					)
						this.c1 = 30;
				}
			} else {
				if (mp.boss3_type === 3 || mp.boss3_type === 7)
					this.x -= 18 * mirror;
				else this.x -= 12 * mirror;
				// 画面外に出たら反転する
				if (direction !== 1 && this.x <= x_border_left) {
					this.x = x_border_left;
					this.c1 = 30;
				} else if (direction === 1 && this.x >= x_border_right) {
					this.x = x_border_right;
					this.c1 = 30;
				}
			}
		} else if (this.c1 === 30) {
			// 体当たり 帰り
			if (mp.boss3_type === 4 || mp.boss3_type === 8) {
				// ジャンプ移動
				this.x += 4 * mirror;
				this.vy += 2;
				if (this.vy > 24) this.vy = 24;
				this.y += this.vy;
				if (this.y >= mp.boss_kijyun_y) {
					this.y = mp.boss_kijyun_y;
					this.vy = -24;
					// 画面外に出たら反転する
					if (
						(direction !== 1 && this.x >= x_border_right) ||
						(direction === 1 && this.x <= x_border_left)
					)
						this.c1 = 40;
				}
			} else {
				if (mp.boss3_type === 3 || mp.boss3_type === 7)
					this.x += 18 * mirror;
				else this.x += 8 * mirror;
				if (direction !== 1 && this.x >= x_border_right) {
					this.x = x_border_right;
					this.c1 = 40;
				}
				if (direction === 1 && this.x <= x_border_left) {
					this.x = x_border_left;
					this.c1 = 40;
				}
			}
		} else if (this.c1 === 40) {
			// 元の位置に戻る
			this.x -= 2 * mirror;
			if (direction !== 1 && this.x <= x_standby_right) {
				this.x = x_standby_right;
				this.c1 = -20;
			}
			if (direction === 1 && this.x >= x_standby_left) {
				this.x = x_standby_left;
				this.c1 = -20;
			}
		}

		// 回転
		if (mp.boss3_type >= 6 && mp.boss3_type <= 8) {
			// boss3_type === 7: 高速回転
			const degree = mp.boss3_type === 7 ? 30 : 15;
			if (this.c1 <= 25) {
				this.c2 -= degree * mirror;
				if (this.c2 < 0) this.c2 += 360;
				if (this.c2 >= 360) this.c2 -= 360;
			} else if (this.c1 === 30) {
				this.c2 += degree * mirror;
				if (this.c2 < 0) this.c2 += 360;
				if (this.c2 >= 360) this.c2 -= 360;
			}
		}
	}

	/**
	 * 主人公とボスが接触しているかどうか判定します
	 * @param {CharacterObject} j 主人公
	 * @returns {boolean}
	 */
	checkHit(j) {
		return (
			j.c >= 100 &&
			j.c < 200 &&
			this.c >= 100 &&
			Math.abs(this.x - j.x) < 42 &&
			j.y > this.y - 20 &&
			j.y < this.y + 40
		);
	}

	/**
	 * ボスが踏むことのできる状態かどうか判定します
	 * @param {MainProgram} mp
	 * @returns {boolean}
	 */
	isFumuable(mp) {
		if (mp.j_tokugi === 10 || (this.j_tokugi >= 12 && this.j_tokugi <= 15))
			return false;
		if (mp.boss_destroy_type === 2) return false;
		return !(
			this.pt === 1250 ||
			this.pt === 1255 ||
			this.pt === 1251 ||
			this.pt === 1256
		);
	}

	/**
	 * 主人公がボスを踏んでいるか判定します
	 * @param {MainProgram} mp
	 */
	checkFumu(mp) {
		const j = mp.co_j;
		if (j.vy <= 0) return false;
		if (mp.easy_mode === 2) {
			// イージーモードの場合は当たり判定が大きい
			return this.checkHit(j);
		}
		return Math.abs(this.x - j.x) < 34;
	}

	/**
	 * ボスが主人公に踏まれてダメージを受けたときの処理をします
	 * @param {MainProgram} mp
	 */
	fumuDamage(mp) {
		const j = mp.co_j;
		this.c4--;
		if (this.c < 200) {
			this.c = BOSS1_DAMAGE_LEFT;
			this.pt = 1010;
		} else if (this.c < 300) {
			this.c = 70;
			this.pt = 1110;
		} else {
			this.c = 80;
			this.pt = 1210;
		}
		if (this.c4 === 1) {
			// 右向き
			// TODO: やっぱり定数を直接代入する
			this.c += 5;
			this.pt += 5;
		}
		this.c1 = 0;
		mp.gs.rsAddSound(8);

		// 主人公が敵を踏んだ状態にする
		j.y = this.y;
		j.vy = -320;
		mp.j_jump_type = 1;
		j.c = 110;
		j.c1 = -4;
		j.pt = 109;
	}
}

export { Boss };
