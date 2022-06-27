;; problem file: problem-a3.pddl
(define (problem a3)
    (:domain a3)
    (:objects kitchen corridor bathroom living_room bedroom child_bedroom guess_bedroom little_bathroom garden outside a3)
	(:init (room kitchen) (room corridor) (room bathroom) (room living_room) (room bedroom) (room child_bedroom) (room guess_bedroom) (room little_bathroom) (linked kitchen living_room) (linked living_room kitchen) (linked corridor living_room) (linked living_room corridor) (linked corridor bathroom) (linked bathroom corridor) (linked bedroom corridor) (linked corridor bedroom) (linked garden outside) (linked outside garden) (linked living_room garden) (linked garden living_room) (robot a3) (in kitchen a3) (is-dirty bathroom) (is-dirty living_room) (is-dirty kitchen))
	(:goal (and (in kitchen a3) (not(is-dirty bedroom)) (not(is-dirty bathroom)) (not(is-dirty living_room)) (not(is-dirty kitchen)) (not(is-dirty corridor))))
)
